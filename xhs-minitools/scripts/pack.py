#!/usr/bin/env python3
"""Package the three standalone tools with Python's standard library."""

import argparse
import hashlib
import os
from pathlib import Path
import re
import sys
import tempfile
import zipfile


ROOT = Path(__file__).resolve().parent.parent
TOOLS = ("image-split", "text-cards", "text-codec")
ALLOWED = {".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".woff", ".woff2", ".json"}
EXCLUDED_NAMES = {"node_modules", "scripts", "tests", "test", "dist", "assets", "package.json", "package-lock.json", "tsconfig.json"}
MAX_ZIP_BYTES = 10 * 1024 * 1024


def package_files(directory):
    files = []
    for candidate in sorted(directory.rglob("*")):
        relative = candidate.relative_to(directory)
        if any(part.startswith(".") or part in EXCLUDED_NAMES for part in relative.parts):
            continue
        if candidate.is_symlink():
            raise ValueError("禁止符号链接 " + str(relative))
        if not candidate.is_file() or candidate.suffix.lower() not in ALLOWED:
            continue
        if re.search(r"(?:^|[.-])(?:test|spec|config)(?:[.-]|$)", candidate.name, re.I):
            continue
        files.append(candidate)
    html = [item.relative_to(directory).as_posix() for item in files if item.suffix.lower() == ".html"]
    if html != ["index.html"]:
        raise ValueError("必须只有一个 HTML，且位于工具根目录 index.html")
    return files


def package_tool(directory, destination):
    files = package_files(directory)
    destination.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary = tempfile.mkstemp(prefix=destination.stem + "-", suffix=".zip", dir=destination.parent)
    os.close(descriptor)
    try:
        with zipfile.ZipFile(temporary, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for source in files:
                entry = zipfile.ZipInfo(source.relative_to(directory).as_posix(), date_time=(1980, 1, 1, 0, 0, 0))
                entry.compress_type = zipfile.ZIP_DEFLATED
                entry.external_attr = 0o100644 << 16
                archive.writestr(entry, source.read_bytes(), compresslevel=9)
        size = Path(temporary).stat().st_size
        if size > MAX_ZIP_BYTES:
            raise ValueError("ZIP 超过 10 MiB 上限")
        with zipfile.ZipFile(temporary) as archive:
            if archive.testzip() is not None:
                raise ValueError("ZIP 完整性校验失败")
        os.replace(temporary, destination)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)
    digest = hashlib.sha256(destination.read_bytes()).hexdigest()
    return {"files": len(files), "bytes": size, "sha256": digest}


def self_test():
    with tempfile.TemporaryDirectory(prefix="xhs-pack-") as temporary:
        directory = Path(temporary) / "tool"
        directory.mkdir()
        for name in ("index.html", "app.js", "styles.css", "README.md", "app.test.js", "vite.config.js", ".DS_Store", "package.json"):
            (directory / name).write_text("test", encoding="utf-8")
        assets = directory / "assets"
        assets.mkdir()
        (assets / "icon.png").write_bytes(b"upload-only")
        destination = Path(temporary) / "tool.zip"
        first = package_tool(directory, destination)
        second = package_tool(directory, destination)
        assert first["sha256"] == second["sha256"]
        with zipfile.ZipFile(destination) as archive:
            assert archive.namelist() == ["app.js", "index.html", "styles.css"]
        (directory / "extra.html").write_text("test", encoding="utf-8")
        try:
            package_tool(directory, destination)
        except ValueError:
            pass
        else:
            raise AssertionError("必须拒绝多个 HTML")
        assert hashlib.sha256(destination.read_bytes()).hexdigest() == first["sha256"]
    print("PASS pack.py 自检")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("tools", nargs="*", metavar="TOOL", help="默认打包全部三个工具")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if any(name not in TOOLS for name in args.tools):
        parser.error("工具名仅支持 " + ", ".join(TOOLS))
    if args.self_test:
        self_test()
        return
    for name in args.tools or TOOLS:
        result = package_tool(ROOT / name, ROOT / "dist" / (name + ".zip"))
        print("{}  {} bytes  {} files  sha256 {}".format(name + ".zip", result["bytes"], result["files"], result["sha256"]))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        print("ERROR " + str(error), file=sys.stderr)
        sys.exit(1)
