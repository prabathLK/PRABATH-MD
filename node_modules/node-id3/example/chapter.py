import eyed3

audiofile = eyed3.load("test.mp3")
for tag in audiofile.tag.chapters:
    print(tag.id)
    print(tag.element_id)
    print(tag.times)
    print(tag.offsets)
    for key, subframe in tag.sub_frames.items():
        print(subframe[0].text)