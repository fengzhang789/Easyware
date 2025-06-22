import Homepage from './components/Homepage'

function App() {
  return (
    <Homepage />
  )




  // return (
  //   <div>
  //     <Test board={`<board width="80mm" height="60mm">
  //   {/* Bluetooth Module - ESP32 */}
  //   <chip
  //     name="U1"
  //     footprint="qfn32"
  //     pinLabels={{
  //       pin1: "VDDA", pin2: "LNA_IN", pin3: "VDD3P3", pin4: "VDD3P3",
  //       pin5: "GPIO36", pin6: "GPIO39", pin7: "GPIO34", pin8: "GPIO35",
  //       pin9: "GPIO32", pin10: "GPIO33", pin11: "GPIO25", pin12: "GPIO26",
  //       pin13: "GPIO27", pin14: "GPIO14", pin15: "GPIO12", pin16: "GND",
  //       pin17: "GPIO13", pin18: "GPIO15", pin19: "GPIO2", pin20: "GPIO0",
  //       pin21: "GPIO4", pin22: "GPIO16", pin23: "GPIO17", pin24: "GPIO5",
  //       pin25: "GPIO18", pin26: "GPIO19", pin27: "GPIO21", pin28: "GPIO3",
  //       pin29: "GPIO1", pin30: "GPIO22", pin31: "GPIO23", pin32: "GND"
  //     }}
  //     pcbX={0}
  //     pcbY={0}
  //   />

  //   {/* Motor Driver - L293D */}
  //   <chip
  //     name="U2"
  //     footprint="dip16_wide"
  //     pinLabels={{
  //       pin1: "EN1", pin2: "IN1", pin3: "OUT1", pin4: "GND",
  //       pin5: "GND", pin6: "OUT2", pin7: "IN2", pin8: "VCC2",
  //       pin9: "EN2", pin10: "IN3", pin11: "OUT3", pin12: "GND",
  //       pin13: "GND", pin14: "OUT4", pin15: "IN4", pin16: "VCC1"
  //     }}
  //     pcbX={25}
  //     pcbY={0}
  //   />

  //   {/* Voltage Regulator - 3.3V */}
  //   <chip
  //     name="U3"
  //     footprint="sot223"
  //     pinLabels={{
  //       pin1: "VIN",
  //       pin2: "GND",
  //       pin3: "VOUT",
  //       pin4: "GND"
  //     }}
  //     pcbX={-25}
  //     pcbY={0}
  //   />

  //   {/* Motor Connection Header */}
  //   <pinheader
  //     name="J1"
  //     pinCount={2}
  //     pitch="2.54mm"
  //     pcbX={25}
  //     pcbY={20}
  //   />

  //   {/* Power Input Header */}
  //   <pinheader
  //     name="J2"
  //     pinCount={2}
  //     pitch="2.54mm"
  //     pcbX={-25}
  //     pcbY={20}
  //   />

  //   {/* Programming Header */}
  //   <pinheader
  //     name="J3"
  //     pinCount={4}
  //     pitch="2.54mm"
  //     pcbX={0}
  //     pcbY={-20}
  //   />

  //   {/* Decoupling Capacitors */}
  //   <capacitor
  //     name="C1"
  //     capacitance="100nF"
  //     footprint="0603"
  //     pcbX={-5}
  //     pcbY={5}
  //   />
    
  //   <capacitor
  //     name="C2"
  //     capacitance="10uF"
  //     footprint="0805"
  //     polarized
  //     pcbX={-5}
  //     pcbY={8}
  //   />

  //   <capacitor
  //     name="C3"
  //     capacitance="100nF"
  //     footprint="0603"
  //     pcbX={20}
  //     pcbY={5}
  //   />

  //   {/* Pull-up Resistors */}
  //   <resistor
  //     name="R1"
  //     resistance="10k"
  //     footprint="0603"
  //     pcbX={-5}
  //     pcbY={-5}
  //   />

  //   <resistor
  //     name="R2"
  //     resistance="10k"
  //     footprint="0603"
  //     pcbX={-5}
  //     pcbY={-8}
  //   />

  //   {/* Status LED */}
  //   <led
  //     name="LED1"
  //     footprint="0603"
  //     color="blue"
  //     pcbX={0}
  //     pcbY={10}
  //   />

  //   <resistor
  //     name="R3"
  //     resistance="330"
  //     footprint="0603"
  //     pcbX={0}
  //     pcbY={13}
  //   />

  //   {/* Reset Button */}
  //   <pushbutton
  //     name="SW1"
  //     footprint="pushbutton"
  //     pcbX={-10}
  //     pcbY={-10}
  //   />

  //   {/* Boot Button */}
  //   <pushbutton
  //     name="SW2"
  //     footprint="pushbutton"
  //     pcbX={10}
  //     pcbY={-10}
  //   />

  //   {/* Power Connections */}
  //   <trace from=".J2 > .pin1" to=".U3 > .pin1" />
  //   <trace from=".J2 > .pin2" to="net.GND" />
  //   <trace from=".U3 > .pin2" to="net.GND" />
  //   <trace from=".U3 > .pin4" to="net.GND" />
  //   <trace from=".U3 > .pin3" to="net.VDD3V3" />

  //   {/* ESP32 Power */}
  //   <trace from=".U1 > .pin3" to="net.VDD3V3" />
  //   <trace from=".U1 > .pin4" to="net.VDD3V3" />
  //   <trace from=".U1 > .pin1" to="net.VDD3V3" />
  //   <trace from=".U1 > .pin16" to="net.GND" />
  //   <trace from=".U1 > .pin32" to="net.GND" />

  //   {/* Motor Driver Power */}
  //   <trace from=".U2 > .pin16" to="net.VDD3V3" />
  //   <trace from=".U2 > .pin8" to=".J2 > .pin1" />
  //   <trace from=".U2 > .pin4" to="net.GND" />
  //   <trace from=".U2 > .pin5" to="net.GND" />
  //   <trace from=".U2 > .pin12" to="net.GND" />
  //   <trace from=".U2 > .pin13" to="net.GND" />

  //   {/* Motor Control Connections */}
  //   <trace from=".U1 > .pin11" to=".U2 > .pin2" />
  //   <trace from=".U1 > .pin12" to=".U2 > .pin7" />
  //   <trace from=".U1 > .pin13" to=".U2 > .pin1" />
  //   <trace from=".U2 > .pin3" to=".J1 > .pin1" />
  //   <trace from=".U2 > .pin6" to=".J1 > .pin2" />

  //   {/* Programming Connections */}
  //   <trace from=".J3 > .pin1" to="net.VDD3V3" />
  //   <trace from=".J3 > .pin2" to="net.GND" />
  //   <trace from=".J3 > .pin3" to=".U1 > .pin29" />
  //   <trace from=".J3 > .pin4" to=".U1 > .pin28" />

  //   {/* Decoupling Capacitor Connections */}
  //   <trace from=".C1 > .pin1" to="net.VDD3V3" />
  //   <trace from=".C1 > .pin2" to="net.GND" />
  //   <trace from=".C2 > .pos" to="net.VDD3V3" />
  //   <trace from=".C2 > .neg" to="net.GND" />
  //   <trace from=".C3 > .pin1" to="net.VDD3V3" />
  //   <trace from=".C3 > .pin2" to="net.GND" />

  //   {/* Pull-up Resistor Connections */}
  //   <trace from=".R1 > .pin1" to="net.VDD3V3" />
  //   <trace from=".R1 > .pin2" to=".U1 > .pin20" />
  //   <trace from=".R2 > .pin1" to="net.VDD3V3" />
  //   <trace from=".R2 > .pin2" to=".SW1 > .pin1" />

  //   {/* LED Connections */}
  //   <trace from=".LED1 > .pos" to=".R3 > .pin1" />
  //   <trace from=".R3 > .pin2" to=".U1 > .pin19" />
  //   <trace from=".LED1 > .neg" to="net.GND" />

  //   {/* Button Connections */}
  //   <trace from=".SW1 > .pin1" to=".U1 > .pin20" />
  //   <trace from=".SW1 > .pin2" to="net.GND" />
  //   <trace from=".SW2 > .pin1" to=".U1 > .pin20" />
  //   <trace from=".SW2 > .pin2" to="net.GND" />

  //   {/* Net definitions */}
  //   <net name="GND" />
  //   <net name="VDD3V3" />
  // </board>`} />
  //   </div>
  // )
}

export default App
