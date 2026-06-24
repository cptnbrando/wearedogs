<!-- A collection of file, image, audio, video, pdf, and other format coverters. -->
<!-- .mp4 to .mp3 -->
<!-- .mp3 to .mp4 -->
<!-- .png to .jpg -->
<!-- .jpg to .png -->
<!-- many more hopefully -->
<!-- to go along with these, i need .sh scripts that will do these same conversions. -->
<!-- remember, this website is currently deployed to github pages. so things are tight -->
<!-- and converters like this might not fly -->

<!-- Converters should be easy to add and remove -->
<!-- Each format probably requires its own specific lib package thing, these should be modularized out -->

<!-- Our converters should specialize in file format specifics, like how .png can have transparency, but .jpg cannot.  -->
<!-- specificities like this should be made clear in the ui -->
<!-- We also optimize for file size first -->
<!-- For all conversions when possible, there should be quality and file size sliders, -->
<!-- with a predictive preview of file quality dimensions and size after an initial scan of uploaded files. -->

<!-- Our converters should be fast -->
<!-- Use webassembly to speed up conversions -->
<!-- and be efficient with memory -->
