



export default function paginate(page, size) {

  !page || page <= 0 || page > 20 ? (page = 1) : "";
  !size || size <= 0 || size > 20 ? (size = 5) : "";
  
  const skip = (page - 1) * size;

  return { skip, limit: size };
}
