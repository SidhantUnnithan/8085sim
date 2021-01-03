// START:	LXI H,5000
// 	MOV A,M
// 	MOV B,A
// 	MVI C,09
// LOOP:	ADD B
// 	DCR C
// 	JNZ LOOP
// 	INX H
// 	ADD M
// 	STA 5100
// 	HLT

// [
//     [ '21', '00', '50' ],
//     [ '7E' ],
//     [ '47' ],
//     [ '0E', '09' ],
//     [ '80' ],
//     [ '0D' ],
//     [ 'C2', '07', '00' ],
//     [ '23' ],
//     [ '86' ],
//     [ '32', '00', '51' ],
//     [ '76' ]
//   ]

String.prototype.count=function(s1) { 
    return (this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length;
}


function execute(jsonInput)
{
    // Input
    // {
    //     instructions: [ (array opcodes returned from server) ]
    //     start-instruction: (index from where to start execution)
    //     steps: (number of instructions to process)
    //     primary-registers: {
    //         A: "00"
    //         B: "00"		
    //         C: "00"
    //         ...		
    //     }
    
    //     flag-registers: {
    //         S: "00"
    //         CY: "00"
    //         Z: "00"
    //         ...
    //     }
    
    //     memory: [
    //         [0, 0, 0, 0, ... (16 times)], 
    //         [0, 0, 0, 0, ... (16 times)], 
    //         [0, 0, 0, 0, ... (16 times)], 
    //         [0, 0, 0, 0, ... (16 times)], 
    //         [0, 0, 0, 0, ... (16 times)], 
    //         [0, 0, 0, 0, ... (16 times)], 
    //         .... (4095 times)    
    //     ]
    // }


    // output
    // {
    //     primary-registers: {
    //         A: "00"
    //         B: "00"		
    //         C: "00"
    //         ...		
    //     }
    
    //     flag-registers: {
    //         S: "00"
    //         CY: "00"
    //         Z: "00"
    //         ...
    //     }
    
    //     memory: [
    //         [0, 0, 0, 0, ... (16 times)], 
    //         [0, 0, 0, 0, ... (16 times)], 
    //         [0, 0, 0, 0, ... (16 times)], 
    //         [0, 0, 0, 0, ... (16 times)], 
    //         [0, 0, 0, 0, ... (16 times)], 
    //         [0, 0, 0, 0, ... (16 times)], 
    //         .... (4095 times)    
    //     ]
    // }


    let opcodes = jsonInput["instructions"];
    let start_address = jsonInput["start-instruction"];
    let steps = jsonInput["steps"];
    let genReg = jsonInput["primary-registers"];
    let flagReg = jsonInput["flag-registers"];
    let memory = jsonInput["memory"];

    start_address = parseInt(start_address, 16);    // converting to int
    let memoryIndex = getMemoryIndex(start_address);

    // for(let x=0; x<steps; x++){
    
    // }

}


function getMemoryIndex(address){
    let i = parseInt(address/16);
    let j = parseInt(address%16);

    return [i,j];
}


function setFlagReg(acc, flagReg){
    let bin = (acc >>> 0).toString(2).padStart(8,'0').slice(-8);

    if(bin[0] === '1'){
        flagReg['S'] = "1";
    }
    else{
        flagReg['S'] = "0";
    }

    if(bin.count('1') === 0){
        flagReg['Z'] = "1";
    }
    else{
        flagReg['Z'] = "0";
    }

    if(bin.count('1')%2 === 0){
        flagReg['P'] = "1";
    }
    else{
        flagReg['P'] = "0";
    }

    if((acc >>> 0).toString(2).padStart(9,'0').slice(-9)[0] === '1'){
        flagReg['CY'] = '1';
    }
    else{
        flagReg['CY'] = '0';
    }

    return flagReg;
}


function add(reg, genReg, flagReg){
    let operand1 = genReg['A'];
    operand1 = parseInt(operand1, 16)
    let operand2;

    operand2 = genReg[reg];
    operand2 = parseInt(operand2, 16);
    
    operand1 += operand2;

    flagReg = setFlagReg(operand1, flagReg);

    operand1 = operand1.toString(16).toUpperCase().padStart(2, '0').slice(-2);
    genReg['A'] = operand1;

    return [genReg, flagReg];
}


function dcr(reg, genReg, flagReg){
    let operand = genReg[reg]
    
    operand = parseInt(operand, 16);

    operand -= 1;
    operand.toString(16);
    flagReg = setFlagReg(operand, flagReg);
    operand = operand.toUpperCase().padStart(2, '0').slice(-2);
    genReg[reg] = operand;

    return [genReg, flagReg];
}


function inr(reg, genReg, flagReg){
    let operand = genReg[reg]
    
    operand = parseInt(operand, 16);

    operand += 1;
    operand.toString(16);
    flagReg = setFlagReg(operand, flagReg);
    operand = operand.toUpperCase().padStart(2, '0').slice(-2);
    genReg[reg] = operand;

    return [genReg, flagReg];
}


function inx(reg, genReg){
    let operand;

    switch(reg){
        case 'B' :
            operand = genReg['B'] + genReg['C'];
            operand = parseInt(operand, 16);
            operand++;
            operand = operand.toString(16).toUpperCase().padStart(4, '0');
            genReg['B'] = operand.slice(2);
            genReg['C'] = operand.slice(-2);
            break;

        case 'D' :
            operand = genReg['D'] + genReg['E'];
            operand = parseInt(operand, 16);
            operand++;
            operand = operand.toString(16).toUpperCase().padStart(4, '0');
            genReg['D'] = operand.slice(2);
            genReg['E'] = operand.slice(-2);
            break;

        case 'H' :
            operand = genReg['H'] + genReg['L'];
            operand = parseInt(operand, 16);
            operand++;
            operand = operand.toString(16).toUpperCase().padStart(4, '0');
            genReg['H'] = operand.slice(2);
            genReg['L'] = operand.slice(-2);
            break;

        case 'SP' :
            operand = genReg['SP'];
            operand = parseInt(operand, 16);
            operand++;
            operand = operand.toString(16).toUpperCase().padStart(4, '0');
            genReg['SP'] = operand;
            break;

        default:
            console.log('lol');
    }

    return genReg;
}


function lxi(reg, byte3, byte2, genReg){
    switch(reg){
        case 'B':
            genReg['B'] = byte2;
            genReg['C'] = byte3;
            break;

        case 'D':
            genReg['D'] = byte2;
            genReg['E'] = byte3;
            break;

        case 'H':
            genReg['H'] = byte2;
            genReg['L'] = byte3;
            break;

        case "SP":
            genReg["SP"] = byte2 + byte3;
            break;

        default:
            console.log("oh damn!");
    }
    return genReg;
}


function instruction_def(instruction, address, genReg, flagReg, memory){
    let tempAdd;
    let memoryIndex;
    let i;
    let j;
    let reg;
    let byte3;
    let byte2;
    let numBytes;

    let opcode = instruction[0];
    
    switch(opcode){
        
        
        // ADD statements
        case "87" :
            // ADD A
            reg = add('A', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;

            break;

        case "80" :
            // ADD B
            reg = add('B', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];

            numBytes = 1;

            break;

        case "81" :
            // ADD C
            reg = add('C', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case "82" :
            // ADD D
            reg = add('D', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;

            break;

        case "83" :
            // ADD E
            reg = add('E', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case "84" :
            // ADD H
            reg = add('H', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;

            break;

        case "85" :
            // ADD L
            reg = add('L', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case "86" :
            // ADD M
            reg = add('M', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;


        // DCR statements
        case "3D" :
            // DCR A
            reg = dcr('A', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case "05" :
            // DCR B
            reg = dcr('B', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case "0D" :
            // DCR C
            reg = dcr('C', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;
        
        case "15" :
            // DCR D
            reg = dcr('D', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case "1D" :
            // DCR E
            reg = dcr('E', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case "25" :
            // DCR H
            reg = dcr('H', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case "2D" :
            // DCR L
            reg = dcr('L', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case "35" :
            // DCR M
            reg = dcr('M', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;


        // HLT statement
        case "76" :
            // HLT
            
            numBytes = 1;
            
            return;


        // INR statements
        case "3C" :
            // INR A
            reg = inr('A', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case  "04" :
            // INR B
            reg = inr('B', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case  "0C" :
            // INR C
            reg = inr('C', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case  "14" :
            // INR D
            reg = inr('D', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case  "1C" :
            // INR E
            reg = inr('E', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case  "24" :
            // INR H
            reg = inr('H', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case  "2C" :
            // INR L
            reg = inr('L', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;

        case  "34" :
            // INR M
            reg = inr('M', genReg, flagReg);
            genReg = reg[0];
            flagReg = reg[1];
            
            numBytes = 1;
            
            break;


        // INX statements
        case "03" :
            // INX B 
            genReg = inx('B', genReg);
            
            numBytes = 1;
            
            break;

        case "13" :
            // INX D 
            genReg = inx('D', genReg);
            
            numBytes = 1;
            
            break;

        case "23" :
            // INX H 
            genReg = inx('H', genReg);
            
            numBytes = 1;
            
            break;

        case "33" :
            // INX SP 
            genReg = inx('SP', genReg);
            
            numBytes = 1;
            
            break;


        // JNZ statement
        case "C2" :
            // JNZ 16bit_data
            byte3 = instruction[1];
            byte2 = instruction[2];
            
            if(flagReg['Z'] !== 0){
                genReg["PC"] = byte2 + byte3;
            }

            numBytes = 3;
            
            break;


        // LXI statements
        case "01" :
            // LXI B 16bit_data
            reg = 'B';
            byte3 = instruction[1];
            byte2 = instruction[2];

            genReg = lxi(reg, byte3, byte2, genReg);
            
            numBytes = 3;
            
            break;

        case "11" :
            // LXI D 16bit_data
            reg = 'D';
            byte3 = instruction[1];
            byte2 = instruction[2];

            genReg = lxi(reg, byte3, byte2, genReg);
            
            numBytes = 3;
            
            break;
            
        case "21" :
            // LXI H 16bit_data
            reg = 'H';
            byte3 = instruction[1];
            byte2 = instruction[2];

            genReg = lxi(reg, byte3, byte2, genReg);
            
            numBytes = 3;
            
            break;

        case "31" :
            // LXI SP 16bit_data
            reg = 'SP';
            byte3 = instruction[1];
            byte2 = instruction[2];

            genReg = lxi(reg, byte3, byte2, genReg);
            
            numBytes = 3;
            
            break;


        // MOV statements
        case "7F" :
            // MOV A A
            
            numBytes = 1;
            
            break;

        case "78" :
            // MOV A B
            genReg["A"] = genReg["B"];
            
            numBytes = 1;
            
            break;
        
        case "79" :
            // MOV A C
            genReg["A"] = genReg["C"];
            
            numBytes = 1;
            
            break;

        case "7A" :
            // MOV A D
            genReg["A"] = genReg["D"];
            
            numBytes = 1;
            
            break;

        case "7B" :
            // MOV A E
            genReg["A"] = genReg["E"];
            
            numBytes = 1;
            
            break;

        case "7C" :
            // MOV A H
            genReg["A"] = genReg["H"];
            
            numBytes = 1;
            
            break;

        case "7D" :
            // MOV A L
            genReg["A"] = genReg["L"];
            
            numBytes = 1;
            
            break;

        case "7E" :
            // MOV A M
            genReg["A"] = genReg['M'];
            
            numBytes = 1;
            
            break;
    

        case "47" :
            // MOV B A
            genReg["B"] = genReg["A"];
            
            numBytes = 1;
            
            break;

        case "40" :
            // MOV B B
            
            numBytes = 1;
            
            break;

        case "41" :
            // MOV B C
            genReg["B"] = genReg["C"];
            
            numBytes = 1;
            
            break;

        case "42" :
            // MOV B D
            genReg["B"] = genReg["D"];
            
            numBytes = 1;
            
            break;

        case "43" :
            // MOV B E
            genReg["B"] = genReg["E"];
            
            numBytes = 1;
            
            break;

        case "44" :
            // MOV B H
            genReg["B"] = genReg["H"];
            
            numBytes = 1;
            
            break;

        case "45" :
            // MOV B L
            genReg["B"] = genReg["L"];
            
            numBytes = 1;
            
            break;

        case "46" :
            // MOV B M
            genReg["B"] = genReg['M'];
            
            numBytes = 1;
            
            break;
    
        case "4F" :
            // MOV C A
            genReg["C"] = genReg["A"];
            
            numBytes = 1;
            
            break;

        case "48" :
            // MOV C B
            genReg["C"] = genReg["B"];
            
            numBytes = 1;
            
            break;

        case "49" :
            // MOV C C
            
            numBytes = 1;
            
            break;

        case "4A" :
            // MOV C D
            genReg["C"] = genReg["D"];
            
            numBytes = 1;
            
            break;

        case "4B" :
            // MOV C E
            genReg["C"] = genReg["E"];
            
            numBytes = 1;
            
            break;

        case "4C" :
            // MOV C H
            genReg["C"] = genReg["H"];
            
            numBytes = 1;
            
            break;

        case "4D" :
            // MOV C L
            genReg["C"] = genReg["L"];
            
            numBytes = 1;
            
            break;

        case "4E" :
            // MOV C M
            genReg["C"] = genReg['M'];
            
            numBytes = 1;
            
            break;

        case "57" :
            // MOV D A
            genReg["D"] = genReg["A"];
            
            numBytes = 1;
            
            break;

        case "50" :
            // MOV D B
            genReg["D"] = genReg["B"];
            
            numBytes = 1;
            
            break;

        case "51" :
            // MOV D C
            genReg["D"] = genReg["C"];
            
            numBytes = 1;
            
            break;

        case "52" :
            // MOV D D
            
            numBytes = 1;
            
            break;

        case "53" :
            // MOV D E
            genReg["D"] = genReg["E"];
            
            numBytes = 1;
            
            break;

        case "54" :
            // MOV D H
            genReg["D"] = genReg["H"];
            
            numBytes = 1;
            
            break;

        case "55" :
            // MOV D L
            genReg["D"] = genReg["L"];
            
            numBytes = 1;
            
            break;

        case "56" :
            // MOV D M
            genReg["D"] = genReg['M'];
            
            numBytes = 1;
            
            break;

        case "5F" :
            // MOV E A
            genReg["E"] = genReg["A"];
            
            numBytes = 1;
            
            break;

        case "58" :
            // MOV E B
            genReg["E"] = genReg["B"];
            
            numBytes = 1;
            
            break;

        case "59" :
            // MOV E C
            genReg["E"] = genReg["C"];
            
            numBytes = 1;
            
            break;

        case "5A" :
            // MOV E D
            genReg["E"] = genReg["D"];
            
            numBytes = 1;
            
            break;

        case "5B" :
            // MOV E E
            
            numBytes = 1;
            
            break;

        case "5C" :
            // MOV E H
            genReg["E"] = genReg["H"];
            
            numBytes = 1;
            
            break;

        case "5D" :
            // MOV E L
            genReg["E"] = genReg["L"];
            
            numBytes = 1;
            
            break;

        case "5E" :
            // MOV E M
            genReg["E"] = genReg['M'];
            
            numBytes = 1;
            
            break;

        case "67" :
            // MOV H A
            genReg["H"] = genReg["A"];
            
            numBytes = 1;
            
            break;

        case "60" :
            // MOV H B
            genReg["H"] = genReg["B"];
            
            numBytes = 1;
            
            break;

        case "61" :
            // MOV H C
            genReg["H"] = genReg["C"];
            
            numBytes = 1;
            
            break;

        case "62" :
            // MOV H D
            genReg["H"] = genReg["D"];
            
            numBytes = 1;
            
            break;

        case "63" :
            // MOV H E
            genReg["H"] = genReg["E"];
            
            numBytes = 1;
            
            break;

        case "64" :
            // MOV H H
            
            numBytes = 1;
            
            break;

        case "65" :
            // MOV H L
            genReg["H"] = genReg["L"];
            
            numBytes = 1;
            
            break;

        case "66" :
            // MOV H M
            genReg["H"] = genReg['M'];
            
            numBytes = 1;
            
            break;

        case "6F" :
            // MOV L A
            genReg["L"] = genReg["A"];
            
            numBytes = 1;
            
            break;

        case "68" :
            // MOV L B
            genReg["L"] = genReg["B"];
            
            numBytes = 1;
            
            break;

        case "69" :
            // MOV L C
            genReg["L"] = genReg["C"];
            
            numBytes = 1;
            
            break;

        case "6A" :
            // MOV L D
            genReg["L"] = genReg["D"];
            
            numBytes = 1;
            
            break;

        case "6B" :
            // MOV L E
            genReg["L"] = genReg["E"];
            
            numBytes = 1;
            
            break;

        case "6C" :
            // MOV L H
            genReg["L"] = genReg["H"];
            
            numBytes = 1;
            
            break;

        case "6D" :
            // MOV L L

            numBytes = 1;
            
            break;

        case "6E" :
            // MOV L M
            genReg["L"] = genReg['M'];
            
            numBytes = 1;
            
            break;

        case "77" :
            // MOV M A
            tempAdd = genReg["H"] + genReg["L"];
            tempAdd = parseInt(tempAdd, 16);
            memoryIndex = getMemoryIndex(tempAdd);
            memory[memoryIndex[0]][memoryIndex[1]] = genReg["A"];
            
            genReg["M"] = genReg["A"]
            numBytes = 1;
            
            break;

        case "70" :
            // MOV M B
            tempAdd = genReg["H"] + genReg["L"];
            tempAdd = parseInt(tempAdd, 16);
            memoryIndex = getMemoryIndex(tempAdd);
            memory[memoryIndex[0]][memoryIndex[1]] = genReg["B"];
            
            genReg["M"] = genReg["B"]
            numBytes = 1;
            
            break;

        case "71" :
            // MOV M C
            tempAdd = genReg["H"] + genReg["L"];
            tempAdd = parseInt(tempAdd, 16);
            memoryIndex = getMemoryIndex(tempAdd);
            memory[memoryIndex[0]][memoryIndex[1]] = genReg["C"];
            
            genReg["M"] = genReg["C"]
            numBytes = 1;
            
            break;

        case "72" :
            // MOV M D
            tempAdd = genReg["H"] + genReg["L"];
            tempAdd = parseInt(tempAdd, 16);
            memoryIndex = getMemoryIndex(tempAdd);
            memory[memoryIndex[0]][memoryIndex[1]] = genReg["D"];
            
            genReg["M"] = genReg["D"]
            numBytes = 1;
            
            break;

        case "73" :
            // MOV M E
            tempAdd = genReg["H"] + genReg["L"];
            tempAdd = parseInt(tempAdd, 16);
            memoryIndex = getMemoryIndex(tempAdd);
            memory[memoryIndex[0]][memoryIndex[1]] = genReg["E"];
            
            genReg["M"] = genReg["E"]
            numBytes = 1;
            
            break;

        case "74" :
            // MOV M H
            tempAdd = genReg["H"] + genReg["L"];
            tempAdd = parseInt(tempAdd, 16);
            memoryIndex = getMemoryIndex(tempAdd);
            memory[memoryIndex[0]][memoryIndex[1]] = genReg["H"];
            
            genReg["M"] = genReg["H"]
            numBytes = 1;
            
            break;

        case "75" :
            // MOV M L
            tempAdd = genReg["H"] + genReg["L"];
            tempAdd = parseInt(tempAdd, 16);
            memoryIndex = getMemoryIndex(tempAdd);
            memory[memoryIndex[0]][memoryIndex[1]] = genReg["L"];
            
            genReg["M"] = genReg["L"]
            numBytes = 1;
            
            break;


        // MVI statements
        case "3E" :
            // MVI A 8bit_data
            byte2 = instruction[1];
            genReg["A"] = byte2;

            numBytes = 2;
            
            break;

        case "06" :
            // MVI B 8bit_data
            byte2 = instruction[1];
            genReg["B"] = byte2;
            
            numBytes = 2;
            
            break;

        case "0E" :
            // MVI C 8bit_data
            byte2 = instruction[1];
            genReg["C"] = byte2;
            
            numBytes = 2;
            
            break;

        case "16" :
            // MVI D 8bit_data
            byte2 = instruction[1];
            genReg["D"] = byte2;
            
            numBytes = 2;
            
            break;

        case "1E" :
            // MVI E 8bit_data
            byte2 = instruction[1];
            genReg["E"] = byte2;
            
            numBytes = 2;
            
            break;

        case "26" :
            // MVI H 8bit_data
            byte2 = instruction[1];
            genReg["H"] = byte2;
            
            numBytes = 2;
            
            break;

        case "2E" :
            // MVI L 8bit_data
            byte2 = instruction[1];
            genReg["L"] = byte2;
            
            numBytes = 2;
            
            break;

        case "36" :
            // MVI M 8bit_data
            byte2 = instruction[1];
            tempAdd = genReg["H"] + genReg["L"];
            tempAdd = parseInt(tempAdd, 16);
            memoryIndex = getMemoryIndex(tempAdd);
            memory[memoryIndex[0]][memoryIndex[1]] = byte2;
            genReg["M"] = byte2;

            numBytes = 2;
            
            break;

        
        // STA statement
        case "32" :
            byte3 = instruction[1];
            byte2 = instruction[2];

            memory[byte2 + byte3] = genReg['A'];
            
            numBytes = 3;
            
            break;


        default: console.log(opcode);
    }

    if(opcode !== "DA" || opcode !== "FA" || opcode !== "C3" || opcode !== "D2" || opcode !== "C2" || opcode !== "F2" || opcode !== "EA" || opcode !== "E2" || opcode !== "CA"){
        genReg["PC"] = parseInt(genReg["PC"], 16) + numBytes;
        genReg["PC"] = genReg["PC"].toString(16).toUpperCase().padStart(4, '0');
    }
    
}