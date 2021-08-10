import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/authCredentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcryptjs'
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto
        const user = new User()

        user.username = username
        user.salt = await bcrypt.genSalt()
        user.password = await bcrypt.hash(password, user.salt)

        try {
            await user.save()
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException(`User with this name already exists`)
            } else {
                throw new InternalServerErrorException(`Something went wrong!`)
            }
        }
    }

    
    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const {username, password} = authCredentialsDto
        const user = await this.findOne({username})

        if(user && await user.validatePassword(password)) {
            return user.username
        }

        return null 
    }
}