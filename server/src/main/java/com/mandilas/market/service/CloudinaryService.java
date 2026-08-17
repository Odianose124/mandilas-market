package com.mandilas.market.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            Cloudinary cloudinary
    ) {
        this.cloudinary = cloudinary;
    }


    // =========================================================
    // UPLOAD IMAGE
    // =========================================================

    public String uploadImage(
            MultipartFile file
    ) throws IOException {

        if (
                file == null ||
                file.isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Image file is required"
            );
        }

        Map<?, ?> result =
                cloudinary
                        .uploader()
                        .upload(
                                file.getBytes(),
                                ObjectUtils.asMap(
                                        "resource_type",
                                        "image",

                                        "folder",
                                        "mandilas-market/products/images"
                                )
                        );

        Object secureUrl =
                result.get("secure_url");

        if (secureUrl == null) {

            throw new IOException(
                    "Cloudinary did not return an image URL"
            );
        }

        return secureUrl.toString();
    }


    // =========================================================
    // UPLOAD VIDEO
    // =========================================================

    public String uploadVideo(
            MultipartFile file
    ) throws IOException {

        if (
                file == null ||
                file.isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Video file is required"
            );
        }

        Map<?, ?> result =
                cloudinary
                        .uploader()
                        .upload(
                                file.getBytes(),
                                ObjectUtils.asMap(
                                        "resource_type",
                                        "video",

                                        "folder",
                                        "mandilas-market/products/videos"
                                )
                        );

        Object secureUrl =
                result.get("secure_url");

        if (secureUrl == null) {

            throw new IOException(
                    "Cloudinary did not return a video URL"
            );
        }

        return secureUrl.toString();
    }
}