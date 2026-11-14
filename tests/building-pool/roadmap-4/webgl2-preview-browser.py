"""Roadmap 4's supported genuine WebGL2 candidate review entrypoint.
Run on a Linux OpenGL QA host with:
  xvfb-run -a env LIBGL_ALWAYS_SOFTWARE=1 python3 tests/building-pool/roadmap-4/webgl2-preview-browser.py
Uses in-memory source-exact modules to avoid blocked localhost navigation.
Never labels CPU Canvas2D captures as WebGL2 or claims physical iPhone testing.
"""
import asyncio
import importlib.util
from pathlib import Path

MODULE=Path(__file__).with_name('webgl2-inline-browser.py')
spec=importlib.util.spec_from_file_location('roadmap4_inline_webgl2',MODULE)
if spec is None or spec.loader is None:
    raise RuntimeError('Missing Roadmap 4 WebGL2 inline acceptance harness')
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

if __name__=='__main__':
    asyncio.run(module.run())
