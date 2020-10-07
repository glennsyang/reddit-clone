import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./User";
import { Post } from "./Post";

// Many to Many
// user <-> posts
// user -> join table <- posts
// user -> updoot <- posts

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
    @Field()
    @Column({ type: "int" })
    value: number;

    @Field()
    @PrimaryColumn()
    userId: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.updoots)
    user: User;

    @Field()
    @PrimaryColumn()
    postId: number;

    @Field(() => Post)
    @ManyToOne(() => Post, (post) => post.updoots)
    post: Post;

}