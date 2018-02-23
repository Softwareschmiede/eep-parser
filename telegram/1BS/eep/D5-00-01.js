const _contact = ['Open', 'Closed'];

class D50001 {
    constructor() {}

    static decode(rawUserData) {
        const contact = rawUserData.readUInt8() << 31 >>> 31; // Offset = 7, size = 1

        return {
            type: 'contact',
            contact: _contact[contact] // 0 = open, 1 = closed
        }
    }

    // userData has always a length of 1 byte.
    // we set the learnMode bit always to 1 (false)
    // based on the value of "contact" the binary is:
    // contact = 0 -> 0000 1000 -> decimal 8
    // contact = 1 -> 0000 1001 -> decimal 9

    static encode(cmd) {
        const template = 8; //  binary = 0000 1000
        const contact = _contact.indexOf(cmd['value']);
        const rawUserData = Buffer.alloc(1, (template + contact)); // only works because the "contact" bit has the offset 7

        return rawUserData;
    }
}


module.exports = D50001;