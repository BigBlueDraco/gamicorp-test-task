import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DataService } from 'src/data/data.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly dataService: DataService,
  ) {}

  async singup(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const existUser = await this.userService.findOneByEmail(
      email.toLowerCase(),
    );
    if (existUser) {
      throw new HttpException(
        `User with email: ${email.toLowerCase()} already exists`,
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await this.userService.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const data = this.dataService.getRandomData();

    return {
      access_token: this.jwtService.sign({
        email: newUser.email,
      }),
      user: { email: newUser.email },
      data,
    };
  }
  async login(loginUser: CreateUserDto) {
    const { email, password } = loginUser;
    const existUser = await this.userService.findOneByEmail(
      email.toLowerCase(),
    );
    const isValidPassword = await compare(
      loginUser.password,
      existUser.password,
    );
    if (!isValidPassword) {
      throw new HttpException(`Unvalid user data`, HttpStatus.CONFLICT);
    }
    const data = await this.dataService.getRandomData();
    return {
      access_token: this.jwtService.sign({
        email: existUser.email,
      }),
      user: { email: existUser.email },
      data,
    };
  }
}
