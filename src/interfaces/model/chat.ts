export default interface chat {
    message: string;
    senderId: string;
    recipientId: string;
    createdAt?: Date;
}
