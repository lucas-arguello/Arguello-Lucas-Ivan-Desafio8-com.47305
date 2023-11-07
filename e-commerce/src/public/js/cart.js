const deleteProduct = async (productId) =>{
    try {

        let cartId = '652832e202a5657f7db4c22a'
        const response = await fetch(
            `/api/carts/${cartId}/products/${productId}`, 
            {
            method: 'DELETE',
            }
        ).then((response) => {
            if (response.status === 200) {
                const result = response.json()
                location.reload()
                console.log('Producto eliminado del carrito');
            }
            else{
                console.error('Error al eliminar el producto del carrito');
            }
        })
    } catch (error) {
        console.error('Error al eliminar un producto:', error.message);
    }

}