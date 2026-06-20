<script>
    // This is a QR Code file transferrer. Visual file transfer. I learned that qr codes are text,
    // so technically they can hold anything.
    // But for like a 1GB video, you'd need hundreds thousands of codes.
    // So that's what this is.
    // A Receiver and a Transmitter
    // Transmitter will allow user to upload a file or type in text (like a quick url too)
    // The transmitter will then create hundreds of thousands of files, and flash them on the screen rapidly.
    // This must have start and stop, a display of current frame count, and should use
    // something like a countdown or something to work with the receiver, to sync up quick

    // The receiver will use the device's camera, and wait for the transmitter's signal
    // Then it will read every qr code flashed in, and re-construct the data
    // It should return the plaintext, or the image video anything file as is, name and metadata and everything
    // Then you can download the transmitted data quickly
    // Stats on the downloaded data should also be presented
</script>
