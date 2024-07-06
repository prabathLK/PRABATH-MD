/**
 * Print a human readable timestamp to the terminal
 * given a number representing seconds
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: 8/18/2014
 * License: MIT
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define FROM_NOW "from now"
#define AGO      "ago"

static char *names[] = {"year", "month", "week", "day", "hour", "minute", "second"};

void usage(FILE *stream) {
	fprintf(stream, "usage: human <seconds> ...\n");
	fprintf(stream, "\n");
	fprintf(stream, "options\n");
	fprintf(stream, "  -h    print this message and exit\n");
	fprintf(stream, "  -s    include a suffix like \"from now\" or \"ago\"\n");
}

void human(int seconds, int dosuffix) {
	char *suffix = FROM_NOW;
	if (seconds < 0) {
		seconds *= -1;
		suffix = AGO;
	}

	int times[] = {
		seconds / 60 / 60 / 24 / 365, // years
		seconds / 60 / 60 / 24 / 30,  // months
		seconds / 60 / 60 / 24 / 7,   // weeks
		seconds / 60 / 60 / 24,       // days
		seconds / 60 / 60,            // hours
		seconds / 60,                 // minutes
		seconds,                      // seconds
	};

	for (int i = 0; i < (int)(sizeof(times) / sizeof(*times)); i++) {
		if (times[i] == 0)
			continue;

		if (times[i] > 1)
			printf("%d %ss", times[i], names[i]);
		else
			printf("%d %s", times[i], names[i]);

		if (dosuffix)
			printf(" %s", suffix);

		printf("\n");
		return;
	}
	printf("right now\n");
}

int main(int argc, char **argv) {
	int dosuffix = 0;

	if (argc <= 1) {
		usage(stderr);
		return 1;
	}

	// purposefully avoid getopt, because it will try to read
	// negative numbers as arguments
	if (strcmp(argv[1], "-h") == 0 || strcmp(argv[1], "--help") == 0) {
		usage(stdout);
		return 0;
	}

	if (strcmp(argv[1], "-s") == 0 || strcmp(argv[1], "--suffix") == 0) {
		dosuffix = 1;
		argc--;
		argv++;
	}

	for (int i = 1; i < argc; i++) {
		human(atoi(argv[i]), dosuffix);
	}

	return 0;
}
