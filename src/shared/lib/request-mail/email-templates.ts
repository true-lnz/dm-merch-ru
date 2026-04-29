import type { RequestPayload, RequestSource, WishlistRequestItem } from "./types";

const rubFormatter = new Intl.NumberFormat("ru-RU");
const ACCENT_COLOR = "#0252c5";
const SITE_ORIGIN = "https://dm-merch.ru";
const HEADER_LOGO_SVG = `
  <svg width="220" height="29" viewBox="0 0 300 40.1593" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="DM Merch" role="img">
    <path d="M90.4088 13.6085V3.97458H85.4531L85.383 5.031C85.1039 9.03046 84.4989 11.8227 83.9171 13.6085H90.4088ZM76.5415 13.5329H78.8218C79.4966 11.7222 80.2876 8.80427 80.6135 4.17564L80.8459 0.000246873H96.1326V13.5329H98.4827V21.1294H93.2242V17.608H81.7768V21.1294H76.5415V13.5329Z" fill="#ffffff"/>
    <path d="M100.135 0.000131607H115.235V3.9242H105.859V6.61565H113.49V10.3384H105.859V13.6838H115.235V17.6079H100.135V0.000131607Z" fill="#ffffff"/>
    <path d="M126.626 7.37038C127.952 7.37038 128.627 6.59042 128.627 5.43348C128.627 4.37678 127.975 3.67279 126.626 3.67279H122.763V7.37038H126.626ZM117.086 4.00543e-05H128.231C132.489 4.00543e-05 134.56 2.33963 134.56 5.38321C134.56 8.62814 132.442 11.0177 128.231 11.0177H122.763V17.6078H117.086V4.00543e-05Z" fill="#ffffff"/>
    <path d="M140.341 7.72233L134.687 0.000139236H140.201L145.344 7.6218C145.274 6.48999 145.227 5.13142 145.227 4.075V0.000139236H150.951V4.075C150.951 5.13142 150.905 6.48999 150.858 7.6218L156 0.000139236H161.514L155.837 7.72233L162.375 17.6079H155.767L150.858 9.55871C150.905 10.6905 150.951 12.0491 150.951 13.1055V17.6079H145.227V13.1055C145.227 12.0491 145.274 10.6905 145.344 9.55871L140.434 17.6079H133.826L140.341 7.72233Z" fill="#ffffff"/>
    <path d="M164.333 9.15527e-05H169.987V11.0429H170.01L175.967 9.15527e-05H182.109V17.6079H176.455V6.56534H176.432L170.499 17.6079H164.333V9.15527e-05Z" fill="#ffffff"/>
    <path d="M190.297 9.15527e-05H198.557L202.21 9.35731H202.233L205.932 9.15527e-05H213.866V17.6079H208.166V5.05626H208.143L203.164 17.6079H199.697L194.857 5.05626H194.834V17.6079H190.297V9.15527e-05Z" fill="#ffffff"/>
    <path d="M226.314 10.942L224.5 4.67861L222.661 10.942H226.314ZM221.405 0H228.618L234.505 17.6078H228.339L227.362 14.3883H221.615L220.637 17.6078H215.518L221.405 0Z" fill="#ffffff"/>
    <path d="M245.696 7.37034C247.023 7.37034 247.697 6.59038 247.697 5.43344C247.697 4.37674 247.046 3.67275 245.696 3.67275H241.834V7.37034H245.696ZM236.157 0H247.302C251.56 0 253.631 2.33959 253.631 5.38317C253.631 8.6281 251.513 11.0177 247.302 11.0177H241.834V17.6078H236.157V0Z" fill="#ffffff"/>
    <path d="M255.283 9.15527e-05H261.053V3.8739C261.053 4.93031 261.007 6.23834 260.96 7.37043L266.521 9.15527e-05H272.338L266.009 7.74742L273.315 17.6079H266.335L260.96 9.80998C261.007 10.9421 261.053 12.2501 261.053 13.3068V17.6079H255.283V9.15527e-05Z" fill="#ffffff"/>
    <path d="M277.222 17.6835L276.5 13.0297H276.919C278.827 13.0297 279.525 12.8789 279.874 12.7278L274.011 1.66284e-05H280.363L283.923 9.13105L287.273 1.66284e-05H292.718L287.692 11.5206C285.761 15.8976 283.713 17.7589 278.734 17.7337C278.176 17.7337 277.617 17.7083 277.222 17.6835Z" fill="#ffffff"/>
    <path d="M294.369 7.0433e-05H300L298.674 10.8415H295.696L294.369 7.0433e-05Z" fill="#ffffff"/>
    <path d="M294.369 12.5522H300V17.7341H294.369V12.5522Z" fill="#ffffff"/>
    <path d="M115.97 39.0712C115.222 39.0712 114.577 38.907 114.035 38.5783C113.493 38.2493 113.076 37.7892 112.784 37.198C112.491 36.6068 112.345 35.9194 112.345 35.1354C112.345 34.3518 112.491 33.6643 112.784 33.0732C113.076 32.482 113.493 32.0219 114.035 31.6929C114.577 31.3639 115.222 31.1997 115.97 31.1997C116.829 31.1997 117.55 31.4147 118.134 31.8451C118.717 32.2752 119.129 32.8581 119.368 33.5929L117.945 33.9913C117.806 33.5332 117.572 33.1774 117.243 32.9235C116.914 32.6699 116.49 32.5431 115.97 32.5431C115.496 32.5431 115.1 32.6496 114.783 32.8632C114.467 33.0769 114.228 33.3776 114.069 33.7657C113.91 34.1541 113.83 34.6108 113.83 35.1354C113.83 35.6604 113.91 36.1167 114.069 36.5054C114.228 36.8936 114.467 37.1946 114.783 37.4079C115.1 37.6212 115.496 37.7281 115.97 37.7281C116.49 37.7281 116.914 37.6004 117.243 37.3448C117.572 37.0898 117.806 36.7345 117.945 36.2798L119.368 36.6782C119.129 37.4131 118.717 37.9954 118.134 38.4258C117.55 38.8562 116.829 39.0712 115.97 39.0712Z" fill="#ffffff"/>
    <path d="M121.196 38.7563L122.235 36.6361L119.679 31.1995H121.279L122.973 35.1353L124.729 31.1995H126.235L122.702 38.7563H121.196Z" fill="#ffffff"/>
    <path d="M128.499 37.4131H130.234C130.425 37.4131 130.594 37.3717 130.743 37.2897C130.892 37.2074 131.009 37.0921 131.094 36.9433C131.179 36.7945 131.221 36.6188 131.221 36.4158C131.221 36.2376 131.185 36.0782 131.112 35.9383C131.039 35.7983 130.929 35.6872 130.782 35.605C130.635 35.523 130.452 35.4819 130.234 35.4819H128.499V37.4131ZM128.499 34.1487H130.037C130.196 34.1487 130.338 34.121 130.463 34.065C130.587 34.0088 130.686 33.9222 130.759 33.8051C130.832 33.6878 130.868 33.5364 130.868 33.3511C130.868 33.1203 130.797 32.9261 130.655 32.7684C130.513 32.6111 130.307 32.5323 130.037 32.5323H128.499V34.1487ZM127.065 38.7562V31.1994H130.058C130.591 31.1994 131.022 31.3068 131.351 31.5221C131.68 31.7372 131.921 32.0076 132.073 32.3329C132.225 32.6582 132.302 32.9872 132.302 33.3196C132.302 33.7429 132.207 34.0947 132.018 34.3743C131.83 34.6542 131.571 34.8416 131.242 34.9361V34.6734C131.709 34.7716 132.06 34.9904 132.294 35.3294C132.528 35.6689 132.644 36.0485 132.644 36.4683C132.644 36.9196 132.562 37.3165 132.397 37.6595C132.233 38.0022 131.983 38.271 131.647 38.4652C131.311 38.6594 130.889 38.7562 130.38 38.7562H127.065Z" fill="#ffffff"/>
    <path d="M133.788 38.7563V31.1995H138.671V32.5323H135.201V34.1485H138.047V35.482H135.201V37.4234H138.671V38.7563H133.788Z" fill="#ffffff"/>
    <path d="M140.021 38.7563V31.1995H141.434V34.3062H144.779V31.1995H146.192V38.7563H144.779V35.639H141.434V38.7563H140.021Z" fill="#ffffff"/>
    <path d="M153.871 38.7563H152.437V33.7184L149.185 38.7563H147.752V31.1995H149.185V36.2377L152.437 31.1995H153.871V38.7563Z" fill="#ffffff"/>
    <path d="M156.841 34.8625H158.524C158.597 34.8625 158.676 34.8588 158.763 34.8519C158.85 34.8448 158.929 34.8311 159.002 34.81C159.193 34.7574 159.34 34.6692 159.444 34.5449C159.548 34.421 159.62 34.2825 159.659 34.1305C159.699 33.978 159.719 33.8338 159.719 33.6973C159.719 33.5611 159.699 33.4168 159.659 33.2646C159.62 33.1124 159.548 32.9744 159.444 32.8499C159.34 32.7257 159.193 32.6372 159.002 32.5849C158.929 32.564 158.85 32.5501 158.763 32.5429C158.676 32.5361 158.597 32.5323 158.524 32.5323H156.841V34.8625ZM155.428 38.7563V31.1995H158.587C158.659 31.1995 158.757 31.202 158.88 31.2075C159.003 31.2129 159.113 31.224 159.21 31.2415C159.657 31.3114 160.023 31.4602 160.308 31.6873C160.594 31.9149 160.805 32.2011 160.94 32.5455C161.075 32.8902 161.142 33.2743 161.142 33.6973C161.142 34.1208 161.074 34.5049 160.937 34.8494C160.8 35.1938 160.589 35.48 160.303 35.7076C160.018 35.9346 159.653 36.0834 159.21 36.1534C159.113 36.1677 159.002 36.178 158.877 36.1848C158.753 36.192 158.656 36.1954 158.587 36.1954H156.841V38.7563H155.428Z" fill="#ffffff"/>
    <path d="M162.285 38.7563V31.1995H163.698V34.3062H167.043V31.1995H168.456V38.7563H167.043V35.639H163.698V38.7563H162.285Z" fill="#ffffff"/>
    <path d="M170.866 35.849H174.814V37.1819H170.866V35.849ZM169.494 38.7564L171.78 31.1995H173.889L176.175 38.7564H174.721L172.684 32.0914H172.954L170.949 38.7564H169.494Z" fill="#ffffff"/>
    <path d="M181.308 34.8625V32.5323H179.626C179.553 32.5323 179.473 32.5361 179.386 32.5429C179.3 32.5501 179.22 32.564 179.147 32.5849C178.957 32.6372 178.81 32.7257 178.706 32.8499C178.602 32.9744 178.53 33.1124 178.49 33.2646C178.451 33.4168 178.431 33.5611 178.431 33.6973C178.431 33.8338 178.451 33.978 178.49 34.1305C178.53 34.2825 178.602 34.421 178.706 34.5449C178.81 34.6692 178.957 34.7574 179.147 34.81C179.22 34.8311 179.3 34.8448 179.386 34.8519C179.473 34.8588 179.553 34.8625 179.626 34.8625H181.308ZM182.721 38.7563H181.308V36.1954H179.563L178.94 36.1534C178.275 36.0486 177.787 35.7713 177.475 35.3217C177.163 34.8722 177.007 34.3307 177.007 33.6973C177.007 33.2743 177.076 32.8902 177.213 32.5455C177.35 32.2011 177.56 31.9149 177.844 31.6873C178.128 31.4602 178.493 31.3114 178.94 31.2415C179.04 31.224 179.151 31.2129 179.272 31.2075C179.393 31.202 179.49 31.1995 179.563 31.1995H182.721V38.7563ZM178.503 38.7563H176.903L178.524 35.3977L179.979 35.681L178.503 38.7563Z" fill="#ffffff"/>
    <path d="M186.46 38.7563V31.1995H192.631V38.7563H191.219V32.5323H187.873V38.7563H186.46Z" fill="#ffffff"/>
    <path d="M195.603 34.8625H197.286C197.359 34.8625 197.438 34.8588 197.525 34.8519C197.611 34.8448 197.691 34.8311 197.764 34.81C197.954 34.7574 198.102 34.6692 198.205 34.5449C198.309 34.421 198.381 34.2825 198.421 34.1305C198.461 33.978 198.481 33.8338 198.481 33.6973C198.481 33.5611 198.461 33.4168 198.421 33.2646C198.381 33.1124 198.309 32.9744 198.205 32.8499C198.102 32.7257 197.954 32.6372 197.764 32.5849C197.691 32.564 197.611 32.5501 197.525 32.5429C197.438 32.5361 197.359 32.5323 197.286 32.5323H195.603V34.8625ZM194.19 38.7563V31.1995H197.348C197.421 31.1995 197.519 31.202 197.642 31.2075C197.765 31.2129 197.875 31.224 197.972 31.2415C198.418 31.3114 198.785 31.4602 199.07 31.6873C199.356 31.9149 199.566 32.2011 199.701 32.5455C199.836 32.8902 199.904 33.2743 199.904 33.6973C199.904 34.1208 199.836 34.5049 199.699 34.8494C199.562 35.1938 199.351 35.48 199.065 35.7076C198.78 35.9346 198.415 36.0834 197.972 36.1534C197.875 36.1677 197.764 36.178 197.639 36.1848C197.514 36.192 197.417 36.1954 197.348 36.1954H195.603V38.7563H194.19Z" fill="#ffffff"/>
    <path d="M204.257 37.728C204.732 37.7351 205.126 37.6317 205.441 37.4184C205.757 37.205 205.993 36.9023 206.15 36.5105C206.308 36.1189 206.387 35.6603 206.387 35.1356C206.387 34.6107 206.308 34.1557 206.15 33.771C205.993 33.3861 205.757 33.0873 205.441 32.8737C205.126 32.6601 204.732 32.5501 204.257 32.5433C203.783 32.5364 203.388 32.6392 203.073 32.8529C202.757 33.0665 202.521 33.3689 202.364 33.7605C202.206 34.1526 202.127 34.6107 202.127 35.1356C202.127 35.6603 202.206 36.1152 202.364 36.5002C202.521 36.8849 202.757 37.1839 203.073 37.3972C203.388 37.6109 203.783 37.7211 204.257 37.728ZM204.257 39.0711C203.509 39.0711 202.864 38.9072 202.322 38.5782C201.78 38.2492 201.363 37.7891 201.07 37.1979C200.778 36.6067 200.631 35.9193 200.631 35.1356C200.631 34.3517 200.778 33.6645 201.07 33.0733C201.363 32.4822 201.78 32.0221 202.322 31.6931C202.864 31.3641 203.509 31.1995 204.257 31.1995C205.005 31.1995 205.65 31.3641 206.192 31.6931C206.734 32.0221 207.151 32.4822 207.444 33.0733C207.737 33.6645 207.883 34.3517 207.883 35.1356C207.883 35.9193 207.737 36.6067 207.444 37.1979C207.151 37.7891 206.734 38.2492 206.192 38.5782C205.65 38.9072 205.005 39.0711 204.257 39.0711Z" fill="#ffffff"/>
    <path d="M210.512 37.434H213.556V32.5429L211.291 32.5323C211.267 32.8785 211.247 33.1972 211.231 33.4874C211.216 33.7778 211.198 34.072 211.177 34.369C211.156 34.6666 211.128 34.9987 211.094 35.366C211.059 35.7336 211.024 36.0351 210.99 36.2713C210.955 36.5078 210.902 36.7134 210.831 36.8882C210.76 37.0633 210.654 37.2449 210.512 37.434ZM208.403 40.0263V37.434C208.628 37.434 208.819 37.3769 208.977 37.2635C209.134 37.1495 209.263 36.9887 209.364 36.7805C209.464 36.5726 209.544 36.3285 209.603 36.0486C209.662 35.7687 209.705 35.4642 209.733 35.1352C209.767 34.7154 209.799 34.3019 209.826 33.894C209.854 33.4868 209.882 33.0632 209.909 32.6243C209.937 32.1853 209.968 31.7104 210.003 31.1995L214.969 31.21V37.434H215.54V40.0263H214.127V38.7669H209.816V40.0263H208.403Z" fill="#ffffff"/>
    <path d="M217.681 38.7563L218.719 36.6361L216.164 31.1995H217.764L219.457 35.1353L221.213 31.1995H222.719L219.187 38.7563H217.681Z" fill="#ffffff"/>
    <path d="M223.55 38.7563V31.1995H224.963V34.684L227.81 31.1995H229.534L226.407 34.9253L229.732 38.7563H227.945L224.963 35.3138V38.7563H223.55Z" fill="#ffffff"/>
    <path d="M236.225 40.016V38.7565H230.563V31.1997H231.976V37.4967H235.384V31.4096H236.796V37.4967H237.638V40.016H236.225Z" fill="#ffffff"/>
    <path d="M244.692 38.7563H243.259V33.7184L240.007 38.7563H238.573V31.1995H240.007V36.2377L243.259 31.1995H244.692V38.7563Z" fill="#ffffff"/>
    <path d="M250.344 34.8625V32.5323H248.661C248.588 32.5323 248.508 32.5361 248.421 32.5429C248.335 32.5501 248.255 32.564 248.183 32.5849C247.992 32.6372 247.845 32.7257 247.741 32.8499C247.637 32.9744 247.565 33.1124 247.526 33.2646C247.486 33.4168 247.466 33.5611 247.466 33.6973C247.466 33.8338 247.486 33.978 247.526 34.1305C247.565 34.2825 247.637 34.421 247.741 34.5449C247.845 34.6692 247.992 34.7574 248.183 34.81C248.255 34.8311 248.335 34.8448 248.421 34.8519C248.508 34.8588 248.588 34.8625 248.661 34.8625H250.344ZM251.757 38.7563H250.344V36.1954H248.598L247.975 36.1534C247.31 36.0486 246.822 35.7713 246.51 35.3217C246.198 34.8722 246.043 34.3307 246.043 33.6973C246.043 33.2743 246.111 32.8902 246.248 32.5455C246.385 32.2011 246.595 31.9149 246.879 31.6873C247.163 31.4602 247.528 31.3114 247.975 31.2415C248.075 31.224 248.186 31.2129 248.307 31.2075C248.429 31.202 248.526 31.1995 248.598 31.1995H251.757V38.7563ZM247.539 38.7563H245.939L247.559 35.3977L249.014 35.681L247.539 38.7563Z" fill="#ffffff"/>
    <path d="M76.5415 38.8442V31.2873H77.8088L80.2816 36.3041L82.7541 31.2873H84.0217V38.8442H82.7021V34.3309L80.5307 38.8442H80.0323L77.8609 34.3309V38.8442H76.5415Z" fill="#ffffff"/>
    <path d="M85.4772 38.8442V31.2873H90.36V32.6202H86.8902V34.2364H89.7367V35.5698H86.8902V37.5113H90.36V38.8442H85.4772Z" fill="#ffffff"/>
    <path d="M93.0187 34.9504H94.7019C94.7745 34.9504 94.854 34.9467 94.9407 34.9398C95.0272 34.9327 95.107 34.919 95.1796 34.8978C95.3699 34.8453 95.5174 34.757 95.6212 34.6328C95.7252 34.5088 95.797 34.3703 95.8369 34.2184C95.8765 34.0659 95.8965 33.9217 95.8965 33.7851C95.8965 33.6489 95.8765 33.5047 95.8369 33.3525C95.797 33.2002 95.7252 33.0623 95.6212 32.9378C95.5174 32.8136 95.3699 32.725 95.1796 32.6728C95.107 32.6519 95.0272 32.6379 94.9407 32.6308C94.854 32.6239 94.7745 32.6202 94.7019 32.6202H93.0187V34.9504ZM91.6057 38.8442V31.2873H94.7641C94.8367 31.2873 94.9348 31.2899 95.0575 31.2953C95.1805 31.3008 95.2904 31.3119 95.3874 31.3293C95.8341 31.3993 96.2005 31.5481 96.486 31.7751C96.7718 32.0028 96.9821 32.2889 97.1173 32.6333C97.2521 32.9781 97.3199 33.3622 97.3199 33.7851C97.3199 34.2087 97.2515 34.5928 97.1147 34.9372C96.9776 35.2817 96.7664 35.5678 96.4809 35.7954C96.1954 36.0225 95.8307 36.1713 95.3874 36.2413C95.2904 36.2555 95.1796 36.2658 95.055 36.2727C94.9303 36.2798 94.8333 36.2832 94.7641 36.2832H93.0187V38.8442H91.6057Z" fill="#ffffff"/>
    <path d="M102.609 38.8442V35.5484L102.806 35.8737C102.616 36.0453 102.345 36.1773 101.993 36.2704C101.642 36.3626 101.276 36.4089 100.894 36.4089C100.271 36.4089 99.7744 36.2844 99.4038 36.0339C99.0332 35.784 98.7666 35.4373 98.6037 34.9949C98.4409 34.5523 98.3598 34.0408 98.3598 33.4599V31.2873H99.7934V33.0295C99.7934 33.2571 99.8021 33.4896 99.8194 33.7277C99.8366 33.9654 99.8875 34.1858 99.9726 34.3889C100.057 34.5917 100.198 34.7553 100.396 34.8795C100.593 35.0038 100.87 35.0658 101.227 35.0658C101.611 35.0658 101.937 34.9986 102.204 34.8638C102.47 34.729 102.657 34.5862 102.765 34.436L102.609 35.0763V31.2873H104.032V38.8442H102.609Z" fill="#ffffff"/>
    <path d="M108.832 40.1593H107.72V30.0144H108.832V40.1593Z" fill="#ffffff"/>
    <path d="M69.1797 0.000119382V38.8441H60.2783V14.8984L50.267 28.4428H47.9093L37.8977 14.8984L35.0744 10.9284C35.1335 11.0466 36.9032 15.4151 36.6453 21.2909C36.3061 29.0205 31.0798 33.7768 29.8532 34.6545C28.2754 35.7834 28.1542 36.0821 24.4282 37.4364C20.7008 38.7907 17.1605 38.8441 17.1605 38.8441H0V12.1899H9.00995V31.2062H17.1605C17.1605 31.2062 19.4495 31.2779 22.2369 29.7971C25.5347 28.0452 27.0454 24.3225 27.3507 22.5367C27.7524 20.1802 28.1556 16.6928 25.6166 12.5326C22.8281 7.96364 16.7853 7.96364 16.7853 7.96364H0V0.000119382H36.8794L49.0881 16.5235L61.2968 0.000119382H69.1797Z" fill="#ffffff"/>
  </svg>
`;

const sourceLabels: Record<RequestSource, string> = {
  "request-cta": "CTA-блок",
  "home-lead-cta": "Блок с примерами мерча",
  "request-dialog": "Модалка заявки",
  "catalog-work-stages": "Этапы работы в каталоге",
  "catalog-product-card": "Карточка товара",
  "home-digest-card": "Карточка подборки",
  "home-hero": "Главный экран",
  "catalog-hero": "Hero каталога",
  "catalog-products-hero": "Hero каталога продукции",
  "home-results": "Блок результатов",
  "home-services": "Блок услуг",
  "home-urgent-order": "Срочный заказ",
  "contacts-page": "Страница контактов",
  "wishlist-dialog": "Вишлист",
};

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function nl2br(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function formatRub(value: number) {
  return `${rubFormatter.format(value)} ₽`;
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Yekaterinburg",
  }).format(value);
}

function renderDetailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:0 0 10px; width:168px; color:#6b7280; font-size:13px; line-height:18px; vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:0 0 10px; color:#111827; font-size:14px; line-height:20px; font-weight:600; vertical-align:top;">${value}</td>
    </tr>
  `;
}

function toAbsoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return new URL(value.startsWith("/") ? value : `/${value}`, SITE_ORIGIN).toString();
}

function renderEmailLink(label: string, href: string, secondaryLabel?: string) {
  const primaryHtml = `<span style="color:#111827; font-weight:700; text-decoration-line:underline; text-decoration-style:dotted; text-decoration-color:#6b7280; text-underline-offset:3px;">${escapeHtml(label)}</span>`;
  const secondaryHtml = secondaryLabel
    ? `<span style="color:#6b7280; font-weight:500; text-decoration:none;"> (${escapeHtml(secondaryLabel)})</span>`
    : "";

  return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer" style="text-decoration:none;">${primaryHtml}${secondaryHtml}</a>`;
}

function renderLayout(title: string, content: string) {
  return `
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0; padding:24px; background:#edf2f7; font-family:Arial,Helvetica,sans-serif; color:#111827;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:760px; border-collapse:collapse; background:#ffffff; border-radius:24px; overflow:hidden;">
                <tr>
                  <td style="padding:28px 32px 26px; background:${ACCENT_COLOR}; color:#ffffff;">
                    <div style="width:220px; max-width:100%; line-height:0;">${HEADER_LOGO_SVG}</div>
                    <div style="margin-top:18px; font-size:28px; line-height:32px; font-weight:700;">${escapeHtml(title)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">${content}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function buildGeneralContent(payload: Extract<RequestPayload, { type: "general" }>, createdAt: Date) {
  const sourceLabel = sourceLabels[payload.source];
  const emailValue = payload.email ? escapeHtml(payload.email) : '<span style="color:#9ca3af; font-weight:500;">Не указан</span>';
  const messageValue = payload.message ? nl2br(payload.message) : '<span style="color:#9ca3af; font-weight:500;">Без комментария</span>';
  const quantityValue =
    typeof payload.quantity === "number" ? escapeHtml(String(payload.quantity)) : '<span style="color:#9ca3af; font-weight:500;">Не указан</span>';
  const contextValue = payload.context ? escapeHtml(payload.context) : '<span style="color:#9ca3af; font-weight:500;">Без уточнения</span>';
  const pageValue = payload.pageTitle
    ? renderEmailLink(payload.pageTitle, toAbsoluteUrl(payload.pagePath), payload.pagePath)
    : renderEmailLink(payload.pagePath, toAbsoluteUrl(payload.pagePath));

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td style="padding:0 0 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; overflow: hidden; background:#f8fafc; outline:1px solid #e5e7eb; border-radius:9px;">
            <tr>
              <td style="padding:22px 24px;">
                <div style="font-size:18px; line-height:24px; font-weight:700; color:#111827;">Контакт клиента</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px; border-collapse:collapse;">
                  ${renderDetailRow("Имя", escapeHtml(payload.name))}
                  ${renderDetailRow("Телефон", escapeHtml(payload.phone))}
                  ${renderDetailRow("Email", emailValue)}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            ${renderDetailRow("Источник", escapeHtml(sourceLabel))}
            ${renderDetailRow("Страница", pageValue)}
            ${renderDetailRow("Контекст", contextValue)}
            ${renderDetailRow("Тираж", quantityValue)}
            ${renderDetailRow("Получено", escapeHtml(formatDateTime(createdAt)))}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 24px;">
          <div style="font-size:18px; line-height:22px; font-weight:700; color:#111827;">Комментарий клиента</div>
          <div style="margin-top:12px; border-radius:9px; background:#f8fafc; border:1px solid #e5e7eb; padding:18px 20px; font-size:14px; line-height:22px; color:#1f2937;">
            ${messageValue}
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="border-radius:18px; background:#0f172a; padding:20px 24px; color:#ffffff;">
            <div style="font-size:10px; line-height:18px; letter-spacing:0.12em; text-transform: uppercase; opacity:0.7;">Следующий шаг</div>
            <div style="margin-top:10px; font-size:18px; line-height:24px; font-weight:700;">Свяжитесь с клиентом и уточните задачу, сроки и тираж.</div>
          </div>
        </td>
      </tr>
    </table>
  `;
}

function renderWishlistTable(items: WishlistRequestItem[]) {
  const rows = items
    .map((item) => {
      const lineTotal = item.quantity * item.unitPriceRub;
      const titleCell = item.productUrl
        ? `<a href="${escapeHtml(item.productUrl)}" target="_blank" rel="noreferrer" style="color:#111827; font-weight:700; text-decoration-line:underline; text-decoration-style:dotted; text-decoration-color:#6b7280; text-underline-offset:3px;">${escapeHtml(
            item.title,
          )}</a>`
        : escapeHtml(item.title);

      return `
        <tr>
          <td style="padding:8px 6px; border-bottom:1px solid #e5e7eb; font-size:13px; line-height:17px; color:#111827; font-weight:600;">${titleCell}</td>
          <td style="padding:8px 6px; border-bottom:1px solid #e5e7eb; font-size:12px; line-height:17px; color:#4b5563;">${escapeHtml(
            item.articleNumber,
          )}</td>
          <td style="padding:8px 4px; border-bottom:1px solid #e5e7eb; font-size:12px; line-height:17px; color:#111827; text-align:center;">${escapeHtml(
            String(item.quantity),
          )}</td>
          <td style="padding:8px 4px; border-bottom:1px solid #e5e7eb; font-size:12px; line-height:17px; color:#111827; text-align:right; white-space:nowrap;">${escapeHtml(
            formatRub(item.unitPriceRub),
          )}</td>
          <td style="padding:8px 6px; border-bottom:1px solid #e5e7eb; font-size:12px; line-height:17px; color:#111827; text-align:right; font-weight:700; white-space:nowrap;">${escapeHtml(
            formatRub(lineTotal),
          )}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; outline:1px solid #e5e7eb; border-radius:9px; overflow:hidden;">
      <thead>
        <tr style="background:#eff6ff;">
          <th style="padding:8px 6px; text-align:left; font-size:10px; line-height:14px; letter-spacing:0.06em; text-transform:uppercase; color:#1d4ed8;">Товар</th>
          <th style="padding:8px 6px; text-align:left; font-size:10px; line-height:14px; letter-spacing:0.06em; text-transform:uppercase; color:#1d4ed8;">Артикул</th>
          <th style="padding:8px 4px; text-align:center; font-size:10px; line-height:14px; letter-spacing:0.06em; text-transform:uppercase; color:#1d4ed8;">Тираж</th>
          <th style="padding:8px 4px; text-align:right; font-size:10px; line-height:14px; letter-spacing:0.06em; text-transform:uppercase; color:#1d4ed8;">Цена</th>
          <th style="padding:8px 6px; text-align:right; font-size:10px; line-height:14px; letter-spacing:0.06em; text-transform:uppercase; color:#1d4ed8;">Сумма</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildWishlistContent(payload: Extract<RequestPayload, { type: "wishlist" }>, createdAt: Date) {
  const emailValue = payload.email ? escapeHtml(payload.email) : '<span style="color:#9ca3af; font-weight:500;">Не указан</span>';
  const messageValue = payload.message ? nl2br(payload.message) : '<span style="color:#9ca3af; font-weight:500;">Без комментария</span>';
  const pageValue = payload.pageTitle
    ? renderEmailLink(payload.pageTitle, toAbsoluteUrl(payload.pagePath), payload.pagePath)
    : renderEmailLink(payload.pagePath, toAbsoluteUrl(payload.pagePath));

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td style="padding:0 0 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            ${renderDetailRow("Имя", escapeHtml(payload.name))}
            ${renderDetailRow("Телефон", escapeHtml(payload.phone))}
            ${renderDetailRow("Email", emailValue)}
            ${renderDetailRow("Источник", escapeHtml(sourceLabels[payload.source]))}
            ${renderDetailRow("Страница", pageValue)}
            ${renderDetailRow("Получено", escapeHtml(formatDateTime(createdAt)))}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 18px;">
          <div style="display:inline-block; border-radius:9px; background:#dbeafe; color:#1d4ed8; padding:10px 16px; font-size:13px; line-height:18px; font-weight:700;">
            Позиций: ${escapeHtml(String(payload.wishlistItems.length))} · Итого: ${escapeHtml(formatRub(payload.totalRub))}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 24px;">
          ${renderWishlistTable(payload.wishlistItems)}
        </td>
      </tr>
      <tr>
        <td>
          <div style="font-size:18px; line-height:22px; font-weight:700; color:#111827;">Комментарий клиента</div>
          <div style="margin-top:12px; border-radius:18px; background:#f8fafc; border:1px solid #e5e7eb; padding:18px 20px; font-size:14px; line-height:22px; color:#1f2937;">
            ${messageValue}
          </div>
        </td>
      </tr>
    </table>
  `;
}

export function buildRequestEmail(payload: RequestPayload) {
  const createdAt = new Date();

  if (payload.type === "wishlist") {
    return {
      subject: `Новая заявка на КП • Вишлист${payload.pageTitle ? ` • ${payload.pageTitle}` : ""}`,
      html: renderLayout("Заявка на коммерческое предложение", buildWishlistContent(payload, createdAt)),
    };
  }

  const sourceLabel = sourceLabels[payload.source];

  return {
    subject: `Новая заявка • ${sourceLabel}${payload.context ? ` • ${payload.context}` : ""}`,
    html: renderLayout("Новая заявка с сайта", buildGeneralContent(payload, createdAt)),
  };
}
