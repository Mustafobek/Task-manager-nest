import { IsString, Matches, MaxLength, MinLength } from "class-validator"

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string
    
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d).*$/, 
        {message: "Invalid password - password must contain chars and numbers"}
    )
    password: string
}
