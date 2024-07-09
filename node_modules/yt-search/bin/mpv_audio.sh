#!/bin/bash

QUERY="$@"
mpv --no-video "$(yt-search $QUERY)"
