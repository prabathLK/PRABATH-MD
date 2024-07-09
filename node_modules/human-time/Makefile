CFLAGS = -Wall -Wextra -Werror -std=c99 -pedantic
BIN = human

all: $(BIN)

human: human.c
	$(CC) $(CFLAGS) -o $@ $^

clean:
	rm -rf $(BIN)

.PHONY: clean all
