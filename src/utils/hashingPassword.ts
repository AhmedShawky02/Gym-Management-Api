import bcrypt from 'bcrypt';

const saltRounds: number = 10;

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt)
}

export async function comparePassword(plainPassword: string, hashedPasssword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPasssword)
}