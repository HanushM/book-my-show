package com.example.demo.entity;

public class Image {

    private String imageName;
    private String imageType;
    private byte[] imageData;  

 
    public Image(String imageName, String imageType, byte[] imageData) {
        this.imageName = imageName;
        this.imageType = imageType;
        this.imageData = imageData;
    }

   
    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }
}
