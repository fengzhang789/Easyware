const cleanCircuitString = (input: string) => {
  let cleaned = input.replace(/^```[a-zA-Z]*\n/, "").replace(/```$/, "");
  cleaned = cleaned.replace(/\\n/g, "\n");
  cleaned = cleaned.replace(/^export default\s*\(\)\s*=>\s*\(\s*\n?/, "");
  cleaned = cleaned.replace(/\n?\s*\)\s*$/, "");

  return cleaned;
};

export default cleanCircuitString;
