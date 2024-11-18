'use client'

import classes from './image-picker.module.css'
import { useRef, useState } from 'react'
import Image from 'next/image'

export default function ImagePicker({ label, name }){

    const [ pickedImage, setPickedImage ] = useState()

    const imageInput = useRef()

    function handlePickClick(){
        imageInput.current.click()
    }

    // this will allow for a preview of the image picker
    function handleImageChange(event){
        const file = event.target.files[0]

        if (!file){
            setPickedImage(null)
            return
        }
        
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPickedImage(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    }

    return(
        <div className={ classes.picker }>
            <label htmlFor={ name }>{ label }</label>
            <div className={ classes.control }>

                <div className={classes.preview}>
                    { !pickedImage && <p>No Image Picked Yes</p> }
                    { pickedImage && < Image 
                        src={ pickedImage } 
                        alt='The image selected by the user'
                        fill
                    /> }
                </div>

                <input 
                    className={ classes.input }
                    type='file' 
                    id= { name } 
                    accept='image/png, image/jpeg' 
                    name={ name }
                    ref = { imageInput }
                    onChange = { handleImageChange }
                    required
                />  
                <button className={ classes.button } type='button' onClick={ handlePickClick }>
                    Pick an image
                </button>                
            </div>
        </div>
    )
}