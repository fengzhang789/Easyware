const str = 
    'export default () => (\n' +
        '  <board width="120mm" height="100mm" autorouter="sequential-trace">\n' +
        '    {/* Define power nets first */}\n' +
        '    <net name="V5" />\n' +
        '    <net name="V12" />\n' +
        '    <net name="GND" />\n' +
        '\n' +
        '    {/* Arduino Uno - Main Controller */}\n' +
        '    <chip\n' +
        '      name="U1"\n' +
        '      footprint="dip28"\n' +
        '      pcbX={0}\n' +
        '      pcbY={0}\n' +
        '      schX={0}\n' +
        '      schY={0}\n' +
        '      pinLabels={{\n' +
        '        pin1: "RST",\n' +
        '        pin2: "D0/RX",\n' +
        '        pin3: "D1/TX",\n' +
        '        pin4: "D2",\n' +
        '        pin5: "D3",\n' +
        '        pin6: "D4",\n' +
        '        pin7: "VCC",\n' +
        '        pin8: "GND",\n' +
        '        pin9: "XTAL1",\n' +
        '        pin10: "XTAL2",\n' +
        '        pin11: "D5",\n' +
        '        pin12: "D6",\n' +
        '        pin13: "D7",\n' +
        '        pin14: "D8",\n' +
        '        pin15: "D9",\n' +
        '        pin16: "D10",\n' +
        '        pin17: "D11",\n' +
        '        pin18: "D12",\n' +
        '        pin19: "D13",\n' +
        '        pin20: "AVCC",\n' +
        '        pin21: "AREF",\n' +
        '        pin22: "GND2",\n' +
        '        pin23: "A0",\n' +
        '        pin24: "A1",\n' +
        '        pin25: "A2",\n' +
        '        pin26: "A3",\n' +
        '        pin27: "A4",\n' +
        '        pin28: "A5"\n' +
        '      }}\n' +
        '    />\n' +
        '\n' +
        '    {/* L293D Motor Driver */}\n' +
        '    <chip\n' +
        '      name="U2"\n' +
        '      footprint="dip16_wide"\n' +
        '      pcbX={-30}\n' +
        '      pcbY={0}\n' +
        '      schX={-8}\n' +
        '      schY={0}\n' +
        '      pinLabels={{\n' +
        '        pin1: "EN1",\n' +
        '        pin2: "IN1",\n' +
        '        pin3: "OUT1",\n' +
        '        pin4: "GND",\n' +
        '        pin5: "GND",\n' +
        '        pin6: "OUT2",\n' +
        '        pin7: "IN2",\n' +
        '        pin8: "VS",\n' +
        '        pin9: "EN2",\n' +
        '        pin10: "IN3",\n' +
        '        pin11: "OUT3",\n' +
        '        pin12: "GND",\n' +
        '        pin13: "GND",\n' +
        '        pin14: "OUT4",\n' +
        '        pin15: "IN4",\n' +
        '        pin16: "VCC"\n' +
        '      }}\n' +
        '    />\n' +
        '\n' +
        '    {/* Ultrasonic Sensor 1 (Front) */}\n' +
        '    <chip\n' +
        '      name="US1"\n' +
        '      footprint="pinrow4"\n' +
        '      pcbX={30}\n' +
        '      pcbY={-20}\n' +
        '      schX={8}\n' +
        '      schY={-5}\n' +
        '      pinLabels={{\n' +
        '        pin1: "VCC",\n' +
        '        pin2: "TRIG",\n' +
        '        pin3: "ECHO",\n' +
        '        pin4: "GND"\n' +
        '      }}\n' +
        '    />\n' +
        '\n' +
        '    {/* Ultrasonic Sensor 2 (Left) */}\n' +
        '    <chip\n' +
        '      name="US2"\n' +
        '      footprint="pinrow4"\n' +
        '      pcbX={30}\n' +
        '      pcbY={0}\n' +
        '      schX={8}\n' +
        '      schY={0}\n' +
        '      pinLabels={{\n' +
        '        pin1: "VCC",\n' +
        '        pin2: "TRIG",\n' +
        '        pin3: "ECHO",\n' +
        '        pin4: "GND"\n' +
        '      }}\n' +
        '    />\n' +
        '\n' +
        '    {/* Ultrasonic Sensor 3 (Right) */}\n' +
        '    <chip\n' +
        '      name="US3"\n' +
        '      footprint="pinrow4"\n' +
        '      pcbX={30}\n' +
        '      pcbY={20}\n' +
        '      schX={8}\n' +
        '      schY={5}\n' +
        '      pinLabels={{\n' +
        '        pin1: "VCC",\n' +
        '        pin2: "TRIG",\n' +
        '        pin3: "ECHO",\n' +
        '        pin4: "GND"\n' +
        '      }}\n' +
        '    />\n' +
        '\n' +
        '    {/* Flame Sensor Module */}\n' +
        '    <chip\n' +
        '      name="FLAME"\n' +
        '      footprint="pinrow3"\n' +
        '      pcbX={-30}\n' +
        '      pcbY={-25}\n' +
        '      schX={-8}\n' +
        '      schY={-6}\n' +
        '      pinLabels={{\n' +
        '        pin1: "VCC",\n' +
        '        pin2: "GND",\n' +
        '        pin3: "DO"\n' +
        '      }}\n' +
        '    />\n' +
        '\n' +
        '    {/* Relay Module for Water Pump */}\n' +
        '    <chip\n' +
        '      name="RELAY"\n' +
        '      footprint="pinrow3"\n' +
        '      pcbX={-30}\n' +
        '      pcbY={25}\n' +
        '      schX={-8}\n' +
        '      schY={6}\n' +
        '      pinLabels={{\n' +
        '        pin1: "VCC",\n' +
        '        pin2: "GND",\n' +
        '        pin3: "IN"\n' +
        '      }}\n' +
        '    />\n' +
        '\n' +
        '    {/* Motor connectors */}\n' +
        '    <pinheader name="M1" pinCount={2} footprint="pinrow2" pcbX={-50} pcbY={-10} schX={-12} schY={-2} />\n' +
        '    <pinheader name="M2" pinCount={2} footprint="pinrow2" pcbX={-50} pcbY={10} schX={-12} schY={2} />\n' +
        '\n' +
        '    {/* Power connector */}\n' +
        '    <pinheader name="PWR" pinCount={2} footprint="pinrow2" pcbX={50} pcbY={0} schX={12} schY={0} />\n' +
        '\n' +
        '    {/* Status LED */}\n' +
        '    <led name="LED1" color="red" footprint="0603" pcbX={0} pcbY={20} schX={0} schY={5} />\n' +
        '    <resistor name="R1" resistance="330" footprint="0603" pcbX={0} pcbY={15} schX={0} schY={3.5} />\n' +
        '\n' +
        '    {/* Decoupling capacitors */}\n' +
        '    <capacitor name="C1" capacitance="100nF" footprint="0603" pcbX={10} pcbY={0} schX={3} schY={0} />\n' +
        '    <capacitor name="C2" capacitance="100nF" footprint="0603" pcbX={-40} pcbY={0} schX={-10} schY={0} />\n' +
        '\n' +
        '    {/* Power connections */}\n' +
        '    <trace from=".U1 > .pin7" to="net.V5" />\n' +
        '    <trace from=".U1 > .pin20" to="net.V5" />\n' +
        '    <trace from=".U1 > .pin8" to="net.GND" />\n' +
        '    <trace from=".U1 > .pin22" to="net.GND" />\n' +
        '\n' +
        '    {/* Motor driver power */}\n' +
        '    <trace from=".U2 > .pin16" to="net.V5" />\n' +
        '    <trace from=".U2 > .pin8" to="net.V12" />\n' +
        '    <trace from=".U2 > .pin4" to="net.GND" />\n' +
        '    <trace from=".U2 > .pin5" to="net.GND" />\n' +
        '    <trace from=".U2 > .pin12" to="net.GND" />\n' +
        '    <trace from=".U2 > .pin13" to="net.GND" />\n' +
        '\n' +
        '    {/* Motor driver control signals */}\n' +
        '    <trace from=".U2 > .pin1" to=".U1 > .pin11" maxLength="40mm" />\n' +
        '    <trace from=".U2 > .pin9" to=".U1 > .pin12" maxLength="40mm" />\n' +
        '    <trace from=".U2 > .pin2" to=".U1 > .pin4" maxLength="40mm" />\n' +
        '    <trace from=".U2 > .pin7" to=".U1 > .pin5" maxLength="40mm" />\n' +
        '    <trace from=".U2 > .pin10" to=".U1 > .pin6" maxLength="40mm" />\n' +
        '    <trace from=".U2 > .pin15" to=".U1 > .pin13" maxLength="40mm" />\n' +
        '\n' +
        '    {/* Motor connections */}\n' +
        '    <trace from=".U2 > .pin3" to=".M1 > .pin1" />\n' +
        '    <trace from=".U2 > .pin6" to=".M1 > .pin2" />\n' +
        '    <trace from=".U2 > .pin11" to=".M2 > .pin1" />\n' +
        '    <trace from=".U2 > .pin14" to=".M2 > .pin2" />\n' +
        '\n' +
        '    {/* Ultrasonic sensor connections */}\n' +
        '    <trace from=".US1 > .pin1" to="net.V5" />\n' +
        '    <trace from=".US1 > .pin4" to="net.GND" />\n' +
        '    <trace from=".US1 > .pin2" to=".U1 > .pin14" maxLength="50mm" />\n' +
        '    <trace from=".US1 > .pin3" to=".U1 > .pin15" maxLength="50mm" />\n' +
        '\n' +
        '    <trace from=".US2 > .pin1" to="net.V5" />\n' +
        '    <trace from=".US2 > .pin4" to="net.GND" />\n' +
        '    <trace from=".US2 > .pin2" to=".U1 > .pin16" maxLength="50mm" />\n' +
        '    <trace from=".US2 > .pin3" to=".U1 > .pin17" maxLength="50mm" />\n' +
        '\n' +
        '    <trace from=".US3 > .pin1" to="net.V5" />\n' +
        '    <trace from=".US3 > .pin4" to="net.GND" />\n' +
        '    <trace from=".US3 > .pin2" to=".U1 > .pin18" maxLength="50mm" />\n' +
        '    <trace from=".US3 > .pin3" to=".U1 > .pin19" maxLength="50mm" />\n' +
        '\n' +
        '    {/* Flame sensor connections */}\n' +
        '    <trace from=".FLAME > .pin1" to="net.V5" />\n' +
        '    <trace from=".FLAME > .pin2" to="net.GND" />\n' +
        '    <trace from=".FLAME > .pin3" to=".U1 > .pin3" maxLength="40mm" />\n' +
        '\n' +
        '    {/* Relay module connections */}\n' +
        '    <trace from=".RELAY > .pin1" to="net.V5" />\n' +
        '    <trace from=".RELAY > .pin2" to="net.GND" />\n' +
        '    <trace from=".RELAY > .pin3" to=".U1 > .pin2" maxLength="40mm" />\n' +
        '\n' +
        '    {/* Status LED */}\n' +
        '    <trace from=".R1 > .pin1" to=".U1 > .pin19" maxLength="30mm" />\n' +
        '    <trace from=".R1 > .pin2" to=".LED1 > .pos" />\n' +
        '    <trace from=".LED1 > .neg" to="net.GND" />\n' +
        '\n' +
        '    {/* Power input */}\n' +
        '    <trace from=".PWR > .pin1" to="net.V12" />\n' +
        '    <trace from=".PWR > .pin2" to="net.GND" />\n' +
        '\n' +
        '    {/* Decoupling capacitors */}\n' +
        '    <trace from=".C1 > .pin1" to="net.V5" />\n' +
        '    <trace from=".C1 > .pin2" to="net.GND" />\n' +
        '    <trace from=".C2 > .pin1" to="net.V5" />\n' +
        '    <trace from=".C2 > .pin2" to="net.GND" />\n' +
        '  </board>\n' +
        ')'
        
console.log(str);