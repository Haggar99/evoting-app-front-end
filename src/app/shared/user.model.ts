export interface Votant {
    firstName?: string;
    lastName?: string;
    isVoted?: boolean;
    email?: string;
    cin?: string;
    password?: string;
    _id?: string;
}

export interface Admin {
    firstName?: string;
    lastName?: string;
    isVoted?: boolean;
    email?: string;
    cin?: string;
    password?: string;
    _id?: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    expiresIn: number;
    user: Votant | Admin;
  }
  export interface Candidat {
    _id: string;
    firstName?: string;
    vote?: string[];
    cin?: boolean;
    email?: string;
    nombreVote: string;
  }