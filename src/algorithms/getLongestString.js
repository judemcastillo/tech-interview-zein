function getLongestNonRepeatString(str) {
	const subStrings = str.split("");
	let longest = [];
	let temp = [];

	for (let i = 0; i < subStrings.length; i++) {
		const char = subStrings[i];
		const prevChar = subStrings[i - 1];
		if (i == 0) {
			temp.push(char);
			longest = temp;
		}
		if (char !== prevChar) {
			temp.push(char);
			if (temp.length > longest.length) {
				longest = temp;
			}
		} else {
			temp = [char];
		}
	}

	return longest.join("");
}

console.log(getLongestNonRepeatString("ABCDDDEFGHIii56756765")); //Ouput: "DEFGHI"
