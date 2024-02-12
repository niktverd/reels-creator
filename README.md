ffmpeg -i input.mp4 -map 0:a -f segment -segment*time 15 output_221021*%03d.aac

ffmpeg -i ./source/sound/third.mp4 -vn -acodec copy ./source/sound/third.aac
