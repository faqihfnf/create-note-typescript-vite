export async function fetchData<T>(url: string) {
  try {
    const response = await fetch(url);

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    console.error(error);
  }
}
