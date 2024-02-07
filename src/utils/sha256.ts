export default async(value: string): Promise<string> => {
  const utf8 = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  hashBuffer.toString();
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(bytes => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
};
