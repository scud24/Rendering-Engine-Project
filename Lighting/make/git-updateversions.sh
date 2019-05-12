#!/bin/bash
#
# @author Zachary Wartell
#
# Goals is to make this into a pre-commit hook, but I don't have time now...
#
# - https://www.atlassian.com/git/tutorials/git-hooks
# - https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
#
# Resources 
# - https://cd34.com/blog/programming/using-git-to-generate-an-automatic-version-number/ 
# - https://softwareengineering.stackexchange.com/questions/141973/how-do-you-achieve-a-numeric-versioning-scheme-with-git
# - https://stackoverflow.com/questions/460297/git-finding-the-sha1-of-an-individual-file-in-the-index



# update project version file "VERSION.txt"
dirRevisionCount=`git log --oneline . | wc -l`     # number of revision to current directory
sed -i -e "s/\([0-9]\.\).*/\1"$dirRevisionCount"/" VERSION.txt
cat VERSION.txt

sed -i -e "s/\(\/*@product_version\*\/\).*;/\1'"`cat VERSION.txt`"';/" version.js


# get all modified files (git status) in current directory ; note, quotes added for filenames with spaces
FILES=`git status --short . | gawk '"^ M *" {print "\"" $2 "\"" }'`

#echo
#echo FILES
echo Modified: $FILES

# update file versions of files named on command-line
# for (( i = $#; i > 0; i--)); do
for FILE in $FILES ; do
	#echo FILE: $FILE
	FILE=$(eval echo $FILE) #strip quotes

	# get file revision found
	fileRevisionCount=`git log --oneline "$FILE" | wc -l`    # number of revisions to file

	# increment by one since file is modified and about to be git commit'ed
	fileRevisionCount=$(( $fileRevisionCount + 1 ))

	# get project version
	projectVersion=`git describe --always --tags --long`   # not used right now... considering using SHA too.
	cleanVersion=${projectversion%%-*}

	# modify @version line in file
	if [[ ! $FILE =~ "git-updateversions.sh" ]]; then
		sed -i -E -e "s/@version[[:space:]]*[^[:space:]]*/@version "`cat VERSION.txt | sed "s/\([[:digit:]]*\).*/\1.x/"`"-"$fileRevisionCount"/" "$FILE"
	fi
done

#echo "$projectVersion-$dirRevisionCount-$fileRevisionCount"
echo "$cleanversion.$dirRevisioncount"

