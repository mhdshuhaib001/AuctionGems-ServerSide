interface mailer {
  sendMail(email: string, otp: number): Promise<boolean>;
}

export default mailer;
