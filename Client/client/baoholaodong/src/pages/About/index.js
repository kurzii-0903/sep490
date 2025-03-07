import React from "react";
import "./style.css";

const sections = [
    {
        title: "Về chúng tôi",
        content:
            "Được cấp phép hoạt động, Minh Xuân là đơn vị chuyên cung cấp bảo hộ lao động chất lượng và uy tín trên cả nước.",
        img: "https://s3-alpha-sig.figma.com/img/a84d/395e/1f846b7b25dc0618df63e644187ed630?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Bwa8PuxqeopNhZAf1-bSkBHELhSjbcE3DM3Wv1ONu7oano0jXaTCsY4qgmwDnA1MAkLVvjivoHTV4TC6mWrQfHNkg86BIv5Sul5q9TO9Q1-WV8GM8Lax3x7ltd1VOodgG-4scpc9RzCILhkQ35iIaMwycO5aCfeAO6VClB31zKtY6QUXCWU0plqBwfyj0B0TyuWC3XLfB-VFsPagkZOMaYq23f1Uiehu7KoRYWk~exHy1mAsb~nyj6e-oKZxU5GELRJLmObRxjT~R8jZCgJWXuIAs58brlZz94-egpScuPrZWhOrNs3~cA0sXuoGI7E1shvpgbjqFVXFV0DDg8aKug__",
    },
    {
        title: "Sản phẩm và dịch vụ",
        content:
            "Chúng tôi cung cấp sản phẩm bảo hộ chất lượng, đảm bảo an toàn cho người lao động.",
        img: "https://s3-alpha-sig.figma.com/img/d10d/74c1/266ef547024564bfa60058c8e00fef86?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=he3vOm8NSUYSTTYFWxvvTcXvCClMEMijA2MxHN8v-a0XcSKIWOkc2nJMgEQ-uLkXefFjB8E~ADzN6HgupCYe4z7Q9CBq~UyR4gYZKrqOZJ9jQ2wMYVrWAr3VDhzgJ-WVQrNIwoiUejnK7pWVAnCsKSJ-wM3B0ftnPdOD0uqFExZoQ6HfqRP0582Exu5KDRGS6Xvtg~nE-d5LipTt6-4338AdshYHfKCbJN8AeF~GOBlKjjPKsCD0dlhFRJ1Vc-1Xg49rdWYudbwjg6MQbVd0LbPw05r56F83NWUkapO7fToCN0JqADc6Wf2DTpM0qmFPnbdpAN6S-gatHes7vPdb6g__",
    },
    {
        title: "Đối tác tin cậy",
        content:
            "Hợp tác với nhiều thương hiệu lớn như ProSafety, Techwear, LSS Asia...",
        img: "https://s3-alpha-sig.figma.com/img/c35c/8eb1/eb2da925638c08502ffa81acea8cfac8?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=doE5Zt3zZAazhNWxi63UajOP3nRVD26~kpCN9WFrEsAdBj0j3J3mW9wI8NMB5kP3I~MMfSY5gONyX9ai2wkwS6DnMdJ4WwqHQfGDvSuspDOGYh7jTFRuRfXcCUQeba~gBqSec2D02wosUOIio6CPEYzFf52HWNgTDVXxDnJTEWBfz-53h-THxFKy-3zRsTYoY-WkGBmRTeKwVoPiUQ72rhnKtVoLgofNoTbVGb1GzOaO2ZJ7vq~iyQs2196tNarUYfFtRzdHWUp7eR3CAXLUMd3nfwIagaTdb8ESBMzrS97v118gNFEzn-FVxOEC9cSl7HApAb~PB5QvZGEfEVzfKA__",
    },
    {
        title: "Đội ngũ nhân viên",
        content:
            "Nhân sự tận tâm, giàu kinh nghiệm, sẵn sàng phục vụ khách hàng.",
        img: "https://s3-alpha-sig.figma.com/img/cb77/2034/26dfcc3a5683c9effdd715aaf6fce6cd?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rtJ1yKUqd9zI~t1E9bv99BsYs0lYJJWE9ysDET7UDfPeEojwYaZByxpVGOi6FcrMKIqiZ~0pWxtVeCV-SPXk2B~P3XQ3XhsPVT2mzlug1SPi5EnVznbaCRevSN~uZWTz1i~oJrsap1DKx~FWMqchJb2-ZMeDqI8aDAEEbMkYWMylG7OGloqybzo3~5w2pqSqvnB0f0pIoGH526Xy078LUm2P1GS9qvJt7GqvKxZdYV73NYGf-F1GZwlk2xciKztCZnBeH4FPucGyolzIWUbtJj0LQa~t2hBY2mZFP9tcB8ydAimttzBGR2CExXBSwfPCUlsSzZGpyyQt-v5BoqvLow__",
    },
    {
        title: "Cam kết của chúng tôi",
        content:
            "Cam kết cung cấp sản phẩm chất lượng và dịch vụ khách hàng tốt nhất.",
        img: "https://s3-alpha-sig.figma.com/img/9a75/946c/aa399b6da5606d72f09ec5915f1c3b30?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=YYpXfBd~JWP2s7dH7DA2FmjqEQbiu9sA~ihP8YxL3NumA4OUClbcWM91UxRRstKG4uVsygRdxbaFJlnJR-a1momR~2Zmnd0hgS~ASP~laJZtxKy80j9BShIurW-ED8EFlHLkyBTavrsnZ9z2UGNPw1hOimgLQ0-AzGM61np415MD7vllXtJxQwmgHqFO6~h~-EUE80gifOMPeBp-5NHPD6sssk37g5wjLZzE1ObmwcrNZroJuOLBmNRVvhsi0CvghoTWVW8YbMIA1t8rsOYxHs0VDg~PcqQEB3BqrgXwF77i0sgeJLgoImo3~Bme6vJ4yxyzEbB8EuiCWe7qZjbvnw__",
    },
];

const About = () => {
    return (
        <div className="about-container">
            <h1 className="title">
                CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI BẢO HỘ LAO ĐỘNG MINH XUÂN
            </h1>
            <p className="subtitle">
                Đồng hành cùng sự an toàn của bạn
            </p>
            {sections.map((section, index) => (
                <div
                    key={index}
                    className={`section ${index % 2 === 1 ? "reverse" : ""}`}
                >
                    <div className="text-content">
                        <h2 className="section-title">{section.title}</h2>
                        <p className="section-text">{section.content}</p>
                    </div>
                    <img
                        src={section.img}
                        alt={section.title}
                        className="image"
                    />
                </div>
            ))}
        </div>
    );
};

export default About;