module.exports = function(packet) {

    const state = ['open', 'closed'];
    const stateBit = packet.data.rawUserData.readUInt8() << 31 >>> 31; // Offset = 7, size = 1

    return {
        type: 'contact',
        state: state[stateBit] // 0 = open, 1 = closed
    }
};