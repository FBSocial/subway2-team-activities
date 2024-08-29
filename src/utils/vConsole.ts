export default async function vConsole() {
  return new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js';
    script.onload = () => {
      // @ts-expect-error ignore
      new window.VConsole();
      resolve();
    };
    document.body.appendChild(script);
  });
}
