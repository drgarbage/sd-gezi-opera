function assert(resolver, message) {
    if(!resolver) throw new Error(message);
}

class SDAPI {
    constructor(host) {
        this.host = host;
    }

    async models() {
        const response = await fetch(`${this.host}/sdapi/v1/sd-models`);
        const result = await response.json();
        return result;
    }

    async img2img(image, options = {}) {

        assert(!!image, 'Image not found.');

        const body = {
            prompt: '',
            negative_prompt: '',
            width: 768,
            height: 768,
            steps: 30,
            cfg_scale: 7,
            denoising_strength: 0.35,
            sampler_name: 'Euler a',
            save_images: true,
            ...options,
            override_settings: {
                sd_model_checkpoint: "6e430eb514",
                ...options?.override_settings
            },
            init_images: [ image ]
        };

        const response = await fetch(`${this.host}/sdapi/v1/img2img`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const result = await response.json();
        
        return result?.images;
        
    }

    async extra(image, options = {}) {

        assert(!!image, 'Image not found.');

        const body = {
            resize_mode: 1,
            show_extras_results: true,
            gfpgan_visibility: 0,
            codeformer_visibility: 0,
            codeformer_weight: 0,
            upscaling_resize: 1,
            upscaling_crop: false,
            upscaler_1: "4x_NMKD-Superscale-SP_178000_G",
            upscaler_2: "None",
            extras_upscaler_2_visibility: 0,
            upscale_first: false,
            image,
            ...options
        };
        const response = await fetch(`${this.host}/sdapi/v1/extra-single-image`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const { image: resultImage } = await response.json();
        
        return resultImage;
    }

    async swap(image, faceImage, options) {

        assert(!!image, 'Image not found.');
        assert(!!faceImage, 'Face image not found.');
        
        const body = {
            source_image: faceImage,
            target_image: image,
            source_faces_index: [ 0 ],
            face_index: [ 0 ],
            upscaler: "None",
            scale: 1,
            upscale_visibility: 1,
            face_restorer: "None",
            restorer_visibility: 1,
            codeformer_weight: 0.5,
            restore_first: 1,
            model: "inswapper_128.onnx",
            gender_source: 0,
            gender_target: 0,
            save_to_file: 0,
            result_file_path: "",
            device: "CPU"
          }

        const response = await fetch(`${this.host}/reactor/image`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const result = response.body;
        
        return result;
    }
}