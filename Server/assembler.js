const {checkInstructionError, parse} = require(__dirname + "/Resources/parse.js")
const { registers, numBytes, opcode, memLoc, label } = require(__dirname + '/Resources/dataStructures.js');

/* 
    The list of instructions are given as input. The input is like 
    ["MOV", "A", "B", "ADD", "B", ...].
    These are to be joined correctly to form proper instructions.
    Returns the instructions in the preferred format, which is like 
    ["MOV A B", "ADD B", ...]
    Labels are of the format "START:", "LOOP:" etc.
*/

var errorList = [];
var labelList = [];


// adds the labels into the labelList from the given input instructionList
function getLabels(instructionList){
    let re = /[A-Z]*:/;

    for(var i=0; i<instructionList.length; i++){
        let cur = instructionList[i];
        
        if(re.test(cur)){
            labelList.push(cur);
        }
    }

}


function getInstructions(instructionList){
    let instructions = [];
    let n = 0;

    for(var i=0; i<instructionList.length; i++){
        let curInstruction = "";
        let  one = instructionList[i];
        let  two,  three;
        if(i+1 < instructionList.length)
            two = instructionList[i+1];
        if(i+2 < instructionList.length)
            three = instructionList[i+2];

        if(one in opcode){
            curInstruction = one;

            if(numBytes[curInstruction] == 2 || numBytes[curInstruction] == 3){
                curInstruction += (" " + two);
                instructions.push(curInstruction);

                i = i + 1;
            }
        }

        if((one + " " + two) in opcode){
            curInstruction =  one + " " +  two;
            
            i = i + 1;

            if(numBytes[curInstruction] == 2 || numBytes[curInstruction] == 3){
                curInstruction = curInstruction + " " + three;
                instructions.push(curInstruction);
                i = i + 1;
            }
            else{
                instructions.push(curInstruction);
            }
        }

        if((one+ " " + two + " " + three) in opcode){
            curInstruction = one + " " + two + " " + three;
            instructions.push(curInstruction);
            i = i + 2;
        }

        // console.log(curInstruction);

        if(curInstruction.length === 0){
            curInstruction = i;
            errorList.push(curInstruction);
        }
        
    }
    return instructions;
}


/* 
    The input will be an array of instructions.
    Returns the opcode of the instructions.
*/
function getOpcodes(instructions){
    
    let opcodeList = [];
    try{
        for(let i=0; i<instructions.length; i++){
            if(checkInstructionError(instructions[i])[0]){
                // err = checkInstructionError(instructions[i]);
                // throw(err);
                // console.log("Error")
            }
                
            let code = parse(instructions[i]);
            // console.log(code);
            opcodeList.push(code);
        }

        return opcodeList;
    }
    catch(err){
        console.log(err[1]);
    }
}

// pgm = "LXI Y 5000 MOV MOV A M";
<<<<<<< HEAD
pgm = "LXI H 5000 MOV A M MOV B A MVI C 09 ADD B DCR C JNZ 5200 INX H ADD M STA 5100 HLT"
instructionList = pgm.split(' ');
=======
// pgm = "LXI Y 5000 MOV A M LXI H 5000 MOV A M MOV B A MVI C 09 ADD B DCR C JNZ 5200 INX H ADD M STA 5100 HLT"
// instructionList = pgm.split(' ');
>>>>>>> test
// console.log(pgm);
console.log(instructionList);

// instructionList = ["MOV","A","B","MOV","C","D","ADD","B","ADI","05", "STA","5020"];

instructions = getInstructions(instructionList);

// console.log(instructions);
<<<<<<< HEAD
// // for(let i=0;i<instructions.length;i++){
// //     getOpcodes()
// // }
console.log(getOpcodes(instructions));
=======
// for(let i=0;i<instructions.length;i++){
//     getOpcodes()
// }
// console.log(getOpcodes(instructions));
// console.log(errorList);
>>>>>>> test



// pgm = "START: LOOP: END: LOL";
// instructionList = pgm.split(' ');
// getLabels(instructionList);
// console.log(labelList);