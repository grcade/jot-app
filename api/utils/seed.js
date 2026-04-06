import { faker } from "@faker-js/faker";
import { createNoteRepository } from "../repository/notes.repository.js";

const generateFakeNotes = async (userId, count = 10) => {
    const notes = [];
    for (let i = 0; i < count; i++) {
        const data = {
            userId: "3312d11c-4f28-49c1-a2e5-45ab61bbb48f",
            title: faker.lorem.sentence(),
            desc: faker.lorem.paragraph(),
            bg: faker.color.human(),
        }


        const result = await createNoteRepository(data);
        notes.push(result);

    }
    return notes;
}

const result = await generateFakeNotes(1, 10);
console.log(result);



// export { generateFakeNotes }
