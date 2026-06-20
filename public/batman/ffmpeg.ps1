# ffmpeg -i s01e01.mp4 -c:v libx265 -crf 20 -preset slow -pix_fmt yuv420p10le `
#     -x265-params "aq-mode=3:aq-strength=0.9:cbqpoff=-1:crqpoff=-1:no-sao=1:bframes=8:limit-sao=1" `
#     -c:a aac -b:a 128k -movflags +faststart s01e01_test.mp4

ffmpeg -i s01e01.mp4 -c:v hevc_nvenc -preset slow -tier high -rc vbr -cq 20 -pix_fmt p010le `
    -spatial_aq 1 -aq-strength 10 -c:a aac -b:a 128k -movflags +faststart s01e01_gpu.mp4