
export async function saveAs(blob: Blob, title: string) {
  const aLink = document.createElement('a');
  aLink.download = title;
  aLink.href = URL.createObjectURL(blob);
  aLink.click();
  URL.revokeObjectURL(blob);
}

export function getFileNameAndExt(filename: string) {
  const arr = filename.split('.');
  const arr1 = arr[0].split('/');
  let name = arr[0];
  let parent = '';
  if (arr1.length > 1) {
    name = arr1[1];
    parent = arr1[0];
  }
  return {
    name,
    ext: arr[1],
    parent
  };
}

export function getLastSlug(path: string) {
  const arr = path.split('/');
  return arr[arr.length - 2];
}