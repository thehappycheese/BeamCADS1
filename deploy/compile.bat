@echo OFF

cd C:\Users\Nicholas\GitHub\BeamCADS1\deploy
echo ------------------
echo COMPILING...
echo ------------------
python compiler2.py
cd cc_v03
timeout 8