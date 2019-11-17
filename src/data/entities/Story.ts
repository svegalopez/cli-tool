import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Privacy {
    private = "private",
    public = "public"
}

@Entity({
    name: 'stories',
})
export class Story {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'launch_date' })
    launchDate!: string

    @Column({ unique: true })
    title!: string

    @Column({ type: 'varchar', length: '32' })
    privacy!: Privacy

    @Column()
    likes!: number
}

