DBG_MAKEFILE ?=
ifeq ($(DBG_MAKEFILE),1)
    $(warning ***** starting Makefile for goal(s) "$(MAKECMDGOALS)")
    $(warning ***** $(shell date))
else
    MAKEFLAGS += -s
endif

weeknotes: # @HELP creates a weeknotes post for the current week
weeknotes:
	@YEAR=$$(date +%Y); \
	WEEK=$$(date +%V); \
	FILENAME=content/posts/weeknotes-$$YEAR-w$$WEEK/index.md; \
	if [ ! -f "$$FILENAME" ]; then \
		hugo new content --kind weeknotes "$$FILENAME"; \
	else \
		echo "$$FILENAME already exists"; \
	fi

serve: # @HELP serves the current site locally with draft posts enabled
serve:
	hugo server -D

help: # @HELP prints this message
help:
	echo "TARGETS:"
	grep -E '^.*: *# *@HELP' $(MAKEFILE_LIST)     \
	    | awk '                                   \
	        BEGIN {FS = ": *# *@HELP"};           \
	        { printf "  %-30s %s\n", $$1, $$2 };  \
	    '
