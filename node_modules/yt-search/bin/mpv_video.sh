#!/bin/bash

QUERY="$@"
mpv "$(yt-search $QUERY)"
