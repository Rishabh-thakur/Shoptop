import Commerce from "@chec/commerce.js";

const Value = process.env.REACT_APP_CHEC_PUBLIC_KEY;
console.log(Value);
export const commerce = new Commerce("pk_42787a1320e3ee90e4ef5986e858c12bb40cf05f279f8",true);
