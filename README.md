ffmpeg -i input.mp4 -map 0:a -f segment -segment_time 15 output_221021_%03d.aac

ffmpeg -i ./source/sound/third.mp4 -vn -acodec copy ./source/sound/third.aac