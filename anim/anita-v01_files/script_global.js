function ReplaceImageExtension( element, ext1, ext2 )
{
	var ex = new RegExp( '.'+ext1, 'g' );
	element.src = element.src.replace( ex, '.'+ext2 );
}

function ImagePNGToAnimGIF( element )
{
	ReplaceImageExtension( element, 'png', 'gif' );
}
function AnimPNGToImageGIF( element )
{
	ReplaceImageExtension( element, 'gif', 'png' );
}
function ImageJPGToAnimGIF( element )
{
	ReplaceImageExtension( element, 'jpg', 'gif' );
}
function AnimGIFToImageJPG( element )
{
	ReplaceImageExtension( element, 'gif', 'jpg' );
}
