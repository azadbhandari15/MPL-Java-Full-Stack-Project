package com.mpl.auctionbackend.auctionbackend.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerPurseDto {

    private String teamName;
    private Double purseAmount;
}
