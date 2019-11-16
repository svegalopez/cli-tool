import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'stories',
})
export class Story {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'launch_date' })
    launchDate!: string

    @Column({type: 'varchar', length: '1024' })
    title!: string

    @Column({ type: 'varchar', length: '32' })
    privacy!: "private" | "public"

    @Column()
    likes!: number
}

