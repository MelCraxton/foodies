import MainHeader from './components/main-header/main-header';
import './globals.css';

export const metadata = {
  title: 'NextLevel Food App',
  description: 'Delicious meals, shared by all in the food-loving community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        < MainHeader />
        {children}
      </body>
    </html>
  );
}
