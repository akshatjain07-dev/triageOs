@echo off
title AegisCare AI - Hospital Triage & Resource Command
cd /d "%~dp0"
echo ============================================================
echo   AEGISCARE AI - HOSPITAL TRIAGE & RESOURCE MANAGEMENT SYSTEM
echo ============================================================
echo   Starting local dev server at http://localhost:5173 ...
echo.
npm run dev -- --host
pause
