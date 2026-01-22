const url = 'https://gajqngmqeidzfotyudcd.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhanFuZ21xZWlkemZvdHl1ZGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwOTY4NDgsImV4cCI6MjA4NDY3Mjg0OH0.V2QTpvLeCVzHCohwMPnDupVw6DXY7OTOSwr6ubB9brU';
const xorKey = 'kb-kb-kb';

function obfuscate(str, k) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ k.charCodeAt(i % k.length));
    }
    return Buffer.from(result).toString('base64');
}

console.log('Obfuscated URL:', obfuscate(url, xorKey));
console.log('Obfuscated Key:', obfuscate(key, xorKey));
