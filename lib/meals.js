import sql from 'better-sqlite3'
import slugify from 'slugify'
import xss from 'xss'
import fs from 'node:fs'

//reach out to the database and get the data

const db=sql('meals.db')

export async function getMeals(){
    // dont normally add this, this is just for teaching demo
    // to demonstrate we can use async
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // use all if you want to get all rows .get will give you a single row
    return db.prepare('SELECT * FROM meals').all()
}


// export function getMeals(){
//     return db.prepare('SELECT * FROM meals').all()
// }

export function getMeal(slug){
    return db.prepare('SELECT * FROM meals where slug= ?').get(slug)
}

export async function saveMeal(meal){
    // meal.slug = slugify(meal.title, { lower:true })
    let slug = slugify(meal.title, { lower:true })

    // can also take this away but it ensure the url 
    // of the page is always unique by adding a timestamp

    let existingMeal = db.prepare('Select 1 from meals where slug = ?').get(slug)
    if (existingMeal){
        const timestamp = Date.now()
        slug = `${slug} - ${timestamp}`
    }
    
    meal.slug = slug
    meal.instructions = xss(meal.instructions)

    // get the image exstension .png .jpg by splitting the name on the last .
    const extension = meal.image.name.split('.').pop()
    // create a random filename for the image
    const randomString = Math.random().toString(36).substring(2,8)
    const fileName = `${meal.slug}-${randomString}.${extension}`
    // this will allow us to write data to a certain folder
    // f.s needs to be imported from next
    const stream = fs.createWriteStream(`public/images/${fileName}`)
    // meal.image = image from form
    const bufferedImage = await meal.image.arrayBuffer()
    stream.write(Buffer.from(bufferedImage), ( error ) =>{
        if(error){
            throw new Error('Saving image failed')
        }
    })
    // dont need to put public/ here
    meal.image = `/images/${fileName}`

    db.prepare(`
        INSERT INTO meals(title, summary, instructions, creator, creator_email, image, slug )
        VALUES (
            @title,
            @summary,
            @instructions,
            @creator,
            @creator_email,
            @image,
            @slug
        )
        `).run(meal)
}